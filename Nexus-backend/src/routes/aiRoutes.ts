import express from "express";
import * as z from "zod";
import passport from "passport";
import { asyncWrap } from "../utils/asyncWrap";
import { getAiExplanation } from "../services/aiExplainService";

const aiRouter = express.Router();

const protect = passport.authenticate("jwt-access", { session: false });

const aiExplainSchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, { message: "Query must be at least 2 characters" })
    .max(120, { message: "Query is too long" }),
});

aiRouter.post(
  "/explain",
  protect,
  asyncWrap(async (req, res) => {
    const parsed = aiExplainSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    try {
      const { result, cached } = await getAiExplanation(parsed.data.query);
      return res.json({ success: true, result, cached });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown AI service error";

      if (message.includes("GEMINI_API_KEY")) {
        return res.status(503).json({
          success: false,
          message,
        });
      }

      console.error("AI explain route error:", error);
      return res.status(502).json({
        success: false,
        message: "AI provider request failed",
      });
    }
  }),
);

export default aiRouter;
