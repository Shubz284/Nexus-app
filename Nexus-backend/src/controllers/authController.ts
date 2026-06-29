import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import * as z from "zod";
import { ContentModel, LinkModel, TagModel, userModel } from "../db.js";
import { random } from "../utils/utils.js";
import { loginSchema, signupSchema } from "../schema/authSchema.js";
import { authCookieMaxAge, authCookieOptions } from "../config/cookies.js";

const cookieOptions = authCookieOptions;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
}

function createTokenPair(
  userId: string,
  accessExpiresIn: string,
  refreshExpiresIn: string,
) {
  const accessKey = requireEnv("ACCESS_KEY") as Secret;
  const refreshKey = requireEnv("REFRESH_KEY") as Secret;

  const accessToken = jwt.sign({ id: userId }, accessKey, {
    expiresIn: accessExpiresIn as SignOptions["expiresIn"],
  });
  const refreshToken = jwt.sign({ id: userId }, refreshKey, {
    expiresIn: refreshExpiresIn as SignOptions["expiresIn"],
  });

  return { accessToken, refreshToken };
}

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: authCookieMaxAge,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: authCookieMaxAge,
  });
}

export async function signup(req: Request, res: Response) {
  const parsedBody = signupSchema.safeParse(req.body);
  if (!parsedBody.success) {
    const errors = parsedBody.error.flatten().fieldErrors;
    return res.status(400).json({ success: false, errors });
  }

  const { userName, email, password } = parsedBody.data;
  const foundUser = await userModel.findOne({ email });

  if (foundUser) {
    return res.status(409).json({
      success: false,
      errors: {
        email: ["An account with this email already exists. Please log in."],
      },
    });
  }

  const hash = await bcrypt.hash(password, 10);
  await userModel.create({
    email,
    userName,
    password: hash,
    authProvider: "local",
  });

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
  });
}

export async function login(req: Request, res: Response) {
  const parsedBody = loginSchema.safeParse(req.body);
  if (!parsedBody.success) {
    return res.status(400).json({
      success: false,
      errors: parsedBody.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parsedBody.data;
  const foundUser = await userModel.findOne({ email });

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      errors: {
        email: ["No user was found with this email."],
      },
    });
  }

  if (!(foundUser as any).password) {
    return res.status(401).json({
      success: false,
      errors: {
        password: [
          "This account uses a different authentication method. Please use Google login.",
        ],
      },
    });
  }

  const isMatch = await bcrypt.compare(password, (foundUser as any).password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      errors: {
        password: ["The password you entered is incorrect."],
      },
    });
  }

  const { accessToken, refreshToken } = createTokenPair(
    String((foundUser as any)._id),
    "24h",
    "7d",
  );
  setAuthCookies(res, accessToken, refreshToken);

  res.status(200).json({ message: "Logged in", success: true });
}

export async function refresh(req: Request, res: Response) {
  requireEnv("ACCESS_KEY");

  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "User not authenticated" });
  }

  const user = req.user as any;
  const newAccessToken = jwt.sign(
    { id: String(user._id) },
    requireEnv("ACCESS_KEY") as Secret,
    {
      expiresIn: "1h" as SignOptions["expiresIn"],
    },
  );

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, {
      ...cookieOptions,
      maxAge: 60 * 60 * 1000,
    })
    .json({ success: true, message: "Token refreshed successfully." });
}

export async function getUser(req: Request, res: Response) {
  res.status(200).json({ user: req.user });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
}

export async function createContent(req: Request, res: Response) {
  const client = req.headers["x-nexus-client"];
  if (client !== "extension" && client !== "web") {
    return res.status(403).json({ msg: "Forbidden" });
  }

  let { title, link, type, tags } = req.body;

  if (!title || !link) {
    return res.status(400).json({ msg: "Title and link are required" });
  }

  if (typeof tags === "string") {
    tags = tags
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
  }

  let tagIds: Array<any> = [];
  if (Array.isArray(tags) && tags.length > 0) {
    const cleaned = tags.map((t: string) => (t || "").trim()).filter(Boolean);
    const unique = Array.from(new Set(cleaned));

    const tagPromises = unique.map(async (tagTitle: string) => {
      const existing = await TagModel.findOne({ title: tagTitle });
      if (existing) return existing._id;
      const created = await TagModel.create({ title: tagTitle });
      return created._id;
    });

    tagIds = await Promise.all(tagPromises);
  }

  await ContentModel.create({
    title,
    link,
    type,
    userId: (req.user as any)._id,
    tags: tagIds,
  });

  res.json({ msg: "Content added", tags: tagIds });
}

export async function getContent(req: Request, res: Response) {
  const userId = (req.user as any)._id;
  const content = await ContentModel.find({ userId })
    .populate("userId", "username")
    .populate("tags", "title");

  res.json({ content });
}

export async function deleteContent(req: Request, res: Response) {
  const contentId = req.body.contentId;
  if (!contentId) {
    return res.status(400).json({ msg: "contentId is required" });
  }

  await ContentModel.deleteOne({
    _id: contentId,
    userId: (req.user as any)._id,
  });

  res.json({ msg: "content deleted" });
}

export async function shareBrain(req: Request, res: Response) {
  const { share } = req.body;

  if (share) {
    const existingLink = await LinkModel.findOne({
      userId: (req.user as any)._id,
    });

    if (existingLink) {
      res.json({ hash: existingLink.hash });
      return;
    }

    const hash = random(10);
    await LinkModel.create({
      userId: (req.user as any)._id,
      hash,
    });

    res.json({ message: "/share/" + hash });
    return;
  }

  await LinkModel.deleteOne({
    userId: (req.user as any)._id,
  });
  res.json({ msg: "Removed the link" });
}

export async function getSharedBrain(req: Request, res: Response) {
  const hash = req.params.shareLink;

  const link = await LinkModel.findOne({ hash });
  if (!link) {
    res.status(411).json({ msg: "Sorry incorrect input" });
    return;
  }

  const content = await ContentModel.find({
    userId: link.userId,
  })
    .populate("userId", "username")
    .populate("tags", "title");

  const user = await userModel.findOne({ _id: link.userId });
  if (!user) {
    res
      .status(411)
      .json({ msg: "user not found, error should ideally not happen" });
    return;
  }

  res.json({
    userName: user.userName,
    content,
  });
}

export async function preview(req: Request, res: Response) {
  const url = req.query.url as string;
  if (!url) {
    return res
      .status(400)
      .json({ success: false, message: "url query param is required" });
  }

  try {
    if (url.includes("instagram.com")) {
      const postMatch = url.match(/\/p\/([A-Za-z0-9_-]+)/);
      if (postMatch && postMatch[1]) {
        const postId = postMatch[1];
        const thumbnailUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;

        console.log(`Instagram preview generated for post ${postId}`);
        return res.json({
          success: true,
          image: thumbnailUrl,
          title: null,
          description: null,
        });
      }
    }

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });
    const text = await resp.text();

    const findMeta = (propNames: string[]) => {
      for (const prop of propNames) {
        const reProp1 = new RegExp(
          `<meta[^>]+property=[\"']${prop}[\"'][^>]*content=[\"']([^\"']+)[\"'][^>]*>`,
          "i",
        );
        const m1 = text.match(reProp1);
        if (m1 && m1[1]) return m1[1];

        const reProp2 = new RegExp(
          `<meta[^>]+content=[\"']([^\"']+)[\"'][^>]*property=[\"']${prop}[\"'][^>]*>`,
          "i",
        );
        const m2 = text.match(reProp2);
        if (m2 && m2[1]) return m2[1];

        const reName = new RegExp(
          `<meta[^>]+name=[\"']${prop}[\"'][^>]*content=[\"']([^\"']+)[\"'][^>]*>`,
          "i",
        );
        const m3 = text.match(reName);
        if (m3 && m3[1]) return m3[1];
      }
      return null;
    };

    const image = findMeta(["og:image", "twitter:image", "image"]) || null;
    const title = findMeta(["og:title", "twitter:title", "title"]) || null;
    const description =
      findMeta(["og:description", "twitter:description", "description"]) ||
      null;

    console.log(`Preview for ${url}:`, { image, title });
    res.json({ success: true, image, title, description });
  } catch (err) {
    console.error("/preview fetch error", err);
    res
      .status(500)
      .json({ success: false, message: "failed to fetch preview" });
  }
}
