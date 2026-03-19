import express, { Request, Response } from "express";
const authRouter = express.Router();
import * as z from "zod";
import { ContentModel, IUser, LinkModel, TagModel, userModel } from "../db";
import bcrypt from "bcrypt";
import { asyncWrap } from "../utils/asyncWrap";
import jwt from "jsonwebtoken";
import passport from "passport";
import multer from "multer";
import path from "path";
import fs from "fs";

import dotenv from "dotenv";
import refreshMiddleware from "../middlewares/refreshMiddleware";
import { random } from "../utils/utils";

dotenv.config();

const signupSchema = z
  .strictObject({
    userName: z
      .string()
      .min(5, { message: "Username must be at least 5 characters." }),

    email: z.string().email({ message: "Invalid email address." }),

    password: z
      .string()
      .min(8, { message: "Must be 8+ characters long" })
      .regex(/[a-z]/, { message: "Must contain a lowercase letter" })
      .regex(/[A-Z]/, { message: "Must contain an uppercase letter" })
      .regex(/[0-9]/, { message: "Must contain a number" })
      .regex(/[^a-zA-Z0-9]/, { message: "Must contain a special character" }),

    confirmPassword: z.string(),
    agree: z.literal(true, {
      message: "You must agree to all terms and conditions.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required" }),
});

authRouter.post(
  "/signup",
  asyncWrap(async (req, res) => {
    // 'next' is available via asyncWrap
    // 1. Zod validation (specific to this route, so we handle it here)
    const parsedBody = signupSchema.safeParse(req.body);
    if (!parsedBody.success) {
      const errors = parsedBody.error.flatten().fieldErrors;
      return res.status(400).json({ success: false, errors });
    }

    const { userName, email, password } = parsedBody.data;

    // 2. Business logic check (user already exists)

    const foundUser = await userModel.findOne({ email: email });
    if (foundUser) {
      return res.status(409).json({
        success: false,
        // Return the error in the same shape as your validation errors
        errors: {
          email: ["An account with this email already exists. Please log in."],
        },
      });
    }

    const hash = await bcrypt.hash(password, 10);

    // Any error during .create() (e.g., duplicate username if it's unique)
    // will be automatically caught by asyncWrap and sent to your central handler.
    await userModel.create({
      email,
      userName,
      password: hash,
      authProvider: "local",
    });

    // sendWelcomeEmail(newUser);

    res.status(201).json({
      success: true,
      message: "Account created successfully.",
    });
  }),
);

authRouter.post(
  "/login",
  asyncWrap(async (req, res) => {
    const parsedBody = loginSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parsedBody.data;

    const foundUser = await userModel.findOne({ email: email });

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        errors: {
          email: ["No user was found with this email."],
        },
      });
    }

    // Type assertion: foundUser.password exists because local auth requires it
    const isMatch = await bcrypt.compare(password, (foundUser as any).password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        errors: {
          password: ["The password you entered is incorrect."],
        },
      });
    }

    const ACCESS_KEY = process.env.ACCESS_KEY;
    if (!ACCESS_KEY) {
      throw new Error("ACCESS_KEY environment variable is required");
    }

    const accessToken = jwt.sign({ id: foundUser._id }, ACCESS_KEY, {
      expiresIn: "24h",
    });

    const REFRESH_KEY = process.env.REFRESH_KEY;
    if (!REFRESH_KEY) {
      throw new Error("REFRESH_KEY environment variable is required");
    }

    const refreshToken = jwt.sign({ id: foundUser._id }, REFRESH_KEY, {
      expiresIn: "7d",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Allows cookies for cross-origin requests
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Allows cookies for cross-origin requests
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Logged in", success: true });
  }),
);

//refresh_token

authRouter.get(
  "/refresh",
  refreshMiddleware,
  asyncWrap(async (req: Request, res: Response) => {
    if (!process.env.ACCESS_KEY) {
      throw new Error("ACCESS_KEY is not defined in the environment variables");
    }

    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    const user = req.user as any;
    const newAccessToken = jwt.sign(
      { id: user._id.toString() },
      process.env.ACCESS_KEY,
      {
        expiresIn: "1h",
      },
    );

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      })
      .json({ success: true, message: "Token refreshed successfully." });
  }),
);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

authRouter.get("/google/callback", (req, res, next) => {
  const googleAuth = passport.authenticate(
    "google",
    { session: false },
    (err, user, info) => {
      // 1. Handle server errors
      if (err) {
        return next(err);
      }
      // 2. Handle custom "email exists" failure
      if (info && info.message === "email_exists") {
        return res.redirect(
          `${process.env.FRONTEND_URI}/auth/login?error=email_exists`,
        );
      }

      // 3. Handle generic failures
      if (!user) {
        return res.redirect(
          `${process.env.FRONTEND_URI}/auth/login?error=auth_failed`,
        );
      }

      // 4. Handle SUCCESS
      // The authenticated user is in the 'user' variable from our callback, NOT req.user.
      try {
        // Use user._id instead of req.user._id
        const accessToken = jwt.sign(
          { id: user._id },
          process.env.ACCESS_KEY!,
          {
            expiresIn: "7d",
          },
        );

        // Use user._id instead of req.user._id
        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.REFRESH_KEY!,
          {
            expiresIn: "15d",
          },
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(`${process.env.FRONTEND_URI}/app/dashboard`);
      } catch (tokenError) {
        return next(tokenError);
      }
    },
  );
  googleAuth(req, res, next);
});

// get user
authRouter.get(
  "/user",
  passport.authenticate("jwt-access", { session: false }),
  asyncWrap((req, res) => {
    res.status(200).json({
      user: req.user,
    });
  }),
);

//logout
authRouter.post(
  "/logout",
  asyncWrap((req, res) => {
    res.clearCookie("accessToken", {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Allows cookies for cross-origin requests
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Allows cookies for cross-origin requests
      path: "/",
    });
    res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  }),
);

const protect = passport.authenticate("jwt-access", { session: false });

authRouter.post(
  "/content",
  protect,
  asyncWrap(async (req, res) => {
    let { title, link, type, tags } = req.body;

    if (!title || !link) {
      return res.status(400).json({ msg: "Title and link are required" });
    }

    // Accept tags sent as a comma-separated string as well as an array
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);
    }

    // Process tags (optional array of strings)
    let tagIds: Array<any> = [];
    if (Array.isArray(tags) && tags.length > 0) {
      // For each tag string, find or create a Tag document
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

    const newContent = await ContentModel.create({
      title,
      link,
      type,
      userId: (req.user as any)._id,
      tags: tagIds,
    });

    res.json({ msg: "Content added", tags: tagIds });
  }),
);

authRouter.get(
  "/content",
  protect,
  asyncWrap(async (req, res) => {
    const userId = (req.user as any)._id;
    const content = await ContentModel.find({
      userId: userId,
    })
      .populate("userId", "username")
      .populate("tags", "title");

    res.json({
      content,
    });
  }),
);

authRouter.delete(
  "/content",
  protect,
  asyncWrap(async (req, res) => {
    const contentId = req.body.contentId;

    if (!contentId) {
      return res.status(400).json({ msg: "contentId is required" });
    }

    await ContentModel.deleteOne({
      _id: contentId,
      userId: (req.user as any)._id,
    });

    res.json({
      msg: "content deleted",
    });
  }),
);

authRouter.post(
  "/brain/share",
  protect,
  asyncWrap(async (req, res) => {
    const { share } = req.body;
    if (share) {
      const existingLink = await LinkModel.findOne({
        userId: (req.user as any)._id,
      });

      if (existingLink) {
        res.json({
          hash: existingLink.hash,
        });
        return;
      }
      const hash = random(10);
      await LinkModel.create({
        userId: (req.user as any)._id,
        hash: hash,
      });
      res.json({
        message: "/share/" + hash,
      });
    } else {
      await LinkModel.deleteOne({
        userId: (req.user as any)._id,
      });
      res.json({
        msg: "Removed the link",
      });
    }
  }),
);

authRouter.get(
  "/brain/:shareLink",
  asyncWrap(async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
      hash,
    });

    if (!link) {
      res.status(411).json({
        msg: "Sorry incorrect input",
      });
      return;
    }

    // userId

    const content = await ContentModel.find({
      userId: link.userId,
    })
      .populate("userId", "username")
      .populate("tags", "title");

    const user = await userModel.findOne({
      _id: link.userId,
    });

    if (!user) {
      res.status(411).json({
        msg: "user not found, error should ideally not happen",
      });
      return;
    }

    res.json({
      userName: user.userName,
      content: content,
    });
  }),
);

// Lightweight preview endpoint to extract Open Graph metadata (og:image, og:title, og:description)
// Uses Instagram oEmbed API for Instagram URLs, standard scraping for others
authRouter.get(
  "/preview",
  asyncWrap(async (req, res) => {
    const url = req.query.url as string;
    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "url query param is required" });
    }

    try {
      // Use Instagram's direct media endpoint for thumbnails
      if (url.includes("instagram.com")) {
        // Extract post ID from URL (e.g., /p/ABC123/)
        const postMatch = url.match(/\/p\/([A-Za-z0-9_-]+)/);
        if (postMatch && postMatch[1]) {
          const postId = postMatch[1];
          // Use Instagram's media endpoint pattern for thumbnails
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

      // For Facebook and other URLs, try standard scraping with proper headers
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
          // property="og:..." with content first or second
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

          // name="twitter:..." or name="..."
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
  }),
);

export default authRouter;
