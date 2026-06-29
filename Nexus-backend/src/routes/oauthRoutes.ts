import express from "express";
import passport from "passport";
import { handleGoogleOAuthCallback } from "../controllers/oauthController.js";

const oauthRouter = express.Router();

oauthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

oauthRouter.get("/google/callback", (req, res, next) => {
  const googleAuth = passport.authenticate(
    "google",
    { session: false },
    (err, user, info) =>
      handleGoogleOAuthCallback(err, user, info, req, res, next),
  );
  googleAuth(req, res, next);
});

export default oauthRouter;
