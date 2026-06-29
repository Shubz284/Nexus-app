import type { CookieOptions } from "express";

/** Cookie settings for JWT auth (local + OAuth). */
export const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Cross-site frontend (e.g. Vercel) + API (e.g. Render) requires SameSite=None.
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
};

export const authCookieMaxAge = 7 * 24 * 60 * 60 * 1000;
