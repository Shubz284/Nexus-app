import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import mongoose from "mongoose";
import session from "express-session";
import errorHandler from "./middlewares/errorHandler.js";
import path from "path";

import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.js";

import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
  "MONGO_URI",
  "PORT",
  "SESSION_SECRET",
  "ACCESS_KEY",
  "REFRESH_KEY",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
  "FRONTEND_URI",
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
}

// --- Standard Middleware ---
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URI,
  process.env.EXTENSION_ORIGIN,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no origin) and configured app/extension origins.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow unpacked Chrome extension during local development.
      if (origin.startsWith("chrome-extension://")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret)
  throw new Error("SESSION_SECRET must be set in the environment");

app.use(
  session({
    // This is the secret used to sign the session ID cookie.
    // It should be a long, random string. Store this in your .env file for security.
    secret: sessionSecret,

    // resave: Forces the session to be saved back to the session store,
    // even if the session was never modified during the request.
    // 'false' is generally recommended.
    resave: false,

    // saveUninitialized: Forces a session that is "uninitialized" to be saved to the store.
    // A session is uninitialized when it is new but not modified.
    // 'false' is good for login sessions, reducing server storage.
    saveUninitialized: false,

    // Optional: configure a cookie, e.g., for security in production
    cookie: {
      secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS. Set to true in production.
      maxAge: 1000 * 60 * 5, // 5 minutes
    },
  }),
);

// --- Passport Middleware ---
app.use(passport.initialize());
app.use(passport.session());

// ----Routes---
app.use("/auth", authRouter);

// error handler
app.use(errorHandler);

async function main() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is required");
  }
  await mongoose.connect(process.env.MONGO_URI);
  app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
}

main();
