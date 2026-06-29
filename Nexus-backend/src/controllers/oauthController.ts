import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authCookieMaxAge, authCookieOptions } from "../config/cookies.js";

const cookieOptions = authCookieOptions;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} environment variable is required`);
  }
  return value;
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

export function handleGoogleOAuthCallback(
  err: any,
  user: any,
  info: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err) {
    return next(err);
  }

  if (info && info.message === "email_exists") {
    return res.redirect(
      `${process.env.FRONTEND_URI}/auth/login?error=email_exists`,
    );
  }

  if (!user) {
    return res.redirect(
      `${process.env.FRONTEND_URI}/auth/login?error=auth_failed`,
    );
  }

  try {
    const accessToken = jwt.sign({ id: user._id }, requireEnv("ACCESS_KEY"), {
      expiresIn: "7d",
    });
    const refreshToken = jwt.sign({ id: user._id }, requireEnv("REFRESH_KEY"), {
      expiresIn: "15d",
    });

    setAuthCookies(res, accessToken, refreshToken);
    res.redirect(`${process.env.FRONTEND_URI}/app/dashboard`);
  } catch (tokenError) {
    return next(tokenError);
  }
}
