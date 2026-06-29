import express from "express";
import passport from "passport";
import { asyncWrap } from "../utils/asyncWrap.js";
import * as authController from "../controllers/authController.js";
import refreshMiddleware from "../middlewares/refreshMiddleware.js";

const authRouter = express.Router();
const protect = passport.authenticate("jwt-access", { session: false });

authRouter.post("/signup", asyncWrap(authController.signup));
authRouter.post("/login", asyncWrap(authController.login));
authRouter.get("/refresh", refreshMiddleware, asyncWrap(authController.refresh));
authRouter.get("/user", protect, asyncWrap(authController.getUser));
authRouter.post("/logout", asyncWrap(authController.logout));

authRouter.post("/content", protect, asyncWrap(authController.createContent));
authRouter.get("/content", protect, asyncWrap(authController.getContent));
authRouter.delete("/content", protect, asyncWrap(authController.deleteContent));
authRouter.post("/brain/share", protect, asyncWrap(authController.shareBrain));
authRouter.get("/brain/:shareLink", asyncWrap(authController.getSharedBrain));
authRouter.get("/preview", asyncWrap(authController.preview));

export default authRouter;
