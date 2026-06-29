import express from "express";
import passport from "passport";
import { asyncWrap } from "../utils/asyncWrap.js";
import * as notesController from "../controllers/notesController.js";

const notesRouter = express.Router();
const protect = passport.authenticate("jwt-access", { session: false });

notesRouter.post("/", protect, asyncWrap(notesController.createNote));
notesRouter.get("/", protect, asyncWrap(notesController.getNotes));
notesRouter.get("/:noteId", protect, asyncWrap(notesController.getNoteById));
notesRouter.put("/:noteId", protect, asyncWrap(notesController.updateNote));
notesRouter.delete("/:noteId", protect, asyncWrap(notesController.deleteNote));
notesRouter.patch(
  "/:noteId/toggle-pin",
  protect,
  asyncWrap(notesController.toggleNotePin),
);
notesRouter.get(
  "/search/query",
  protect,
  asyncWrap(notesController.searchNotes),
);

export default notesRouter;
