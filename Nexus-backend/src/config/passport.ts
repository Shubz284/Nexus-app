import passport from "passport";
import { Strategy as JwtStrategy, StrategyOptions } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import "dotenv/config";
import AppError from "../utils/appError.js";
import { asyncWrap } from "../utils/asyncWrap.js";
import { Request } from "express";
import { userModel } from "../db.js";
import { Types } from "mongoose";
import { UserDocument } from "../types/types.js";

// --- Strategy 1: For Verifying the ACCESS Token ---

// Extractor for the access token (supports both cookie and Authorization header)
const accessTokenExtractor = (req: Request) => {
  let token = null;

  // First, try to get token from cookies
  if (req && req.cookies) {
    token = req.cookies.accessToken;
  }

  // If not in cookies, try Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  return token;
};

// checkin ACCESS_KEY exist

const ACCESS_KEY = process.env.ACCESS_KEY;
if (!ACCESS_KEY) {
  throw new Error("ACCESS_KEY environment variable must be defined");
}

const accessOptions: StrategyOptions = {
  secretOrKey: ACCESS_KEY, // The secret used to verify JWT signatures
  jwtFromRequest: accessTokenExtractor, //Your custom function that extracts tokens from cookies
};

// We name this strategy 'jwt-access'

passport.use(
  "jwt-access",
  new JwtStrategy(accessOptions, async (jwt_payload, done) => {
    try {
      const user = await userModel
        .findById(jwt_payload.id)
        .select("-password -__v -createdAt -updatedAt");
      if (user) {
        return done(null, user); // Success, user is found
      }
      return done(null, false); // No user found
    } catch (err) {
      return done(err, false); //Error occurred during authentication"
    }
  })
);

// --- Strategy 2: For Verifying the REFRESH Token ---

// Extractor for the refresh token (supports both cookie and Authorization header)
const refreshTokenExtractor = (req: Request) => {
  let token = null;

  // First, try to get token from cookies
  if (req && req.cookies) {
    token = req.cookies.refreshToken;
  }

  // If not in cookies, try Authorization header
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7); // Remove 'Bearer ' prefix
    }
  }

  return token;
};

const REFRESH_KEY = process.env.REFRESH_KEY;
if (!REFRESH_KEY) {
  throw new Error("REFRESH_KEY environment variable must be defined");
}

const refreshOptions: StrategyOptions = {
  // IMPORTANT: Use the refresh key here!
  secretOrKey: REFRESH_KEY,
  jwtFromRequest: refreshTokenExtractor,
};

// We name this strategy 'jwt-refresh'
passport.use(
  "jwt-refresh",
  new JwtStrategy(refreshOptions, async (jwt_payload, done) => {
    try {
      // The logic is identical: find the user based on the token
      const user = await userModel
        .findById(jwt_payload.id)
        .select("-password -__v -createdAt -updatedAt");
      if (user) {
        return done(null, user); // Success, user is found
      }
      return done(null, false); // No user found
    } catch (err) {
      console.log(err);
      return done(err, false);
    }
  })
);

// google statergy

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI;
if (!googleClientId || !googleClientSecret || !googleRedirectUri) {
  throw new Error("Missing Google OAuth environment variables");
}

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleRedirectUri,
    },
    async function (accessToken, refreshToken, profile, done) {
      const userEmail = profile.emails?.[0]?.value;
      const googleId = profile.id;
      try {
        const user = (await userModel.findOne({
          googleId: googleId,
        })) as UserDocument | null;
        if (user) {
          // User found with Google ID, this is a returning social user
          return done(null, user);
        }

        const existingUser = (await userModel.findOne({
          email: userEmail,
        })) as UserDocument | null;
        if (existingUser) {
          // The email exists, but not linked to a Google account.
          // This is a predictable authentication failure, not a server error.
          return done(null, false, { message: "email_exists" });
        }
        const newUser = (await userModel.create({
          googleId: googleId,
          userName: profile.displayName,
          email: userEmail,
          profilePictureUrl: profile.photos?.[0].value,
          authProvider: "google",
        })) as UserDocument;

        return done(null, newUser);
      } catch (error) {
        console.log(error);
        return done(error, null!);
      }
    }
  )
);
