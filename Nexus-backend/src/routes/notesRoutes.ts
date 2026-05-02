import express, { Request, Response } from "express";
import passport from "passport";
import * as z from "zod";
import { NoteModel, TagModel } from "../db.js";
import { asyncWrap } from "../utils/asyncWrap.js";

const notesRouter = express.Router();

const protect = passport.authenticate("jwt-access", { session: false });

// Zod validation schemas
const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  color: z.string().optional().default("bg-yellow-100"),
  isPinned: z.boolean().optional().default(false),
});

const updateNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
  isPinned: z.boolean().optional(),
});

// Create a new note
notesRouter.post(
  "/",
  protect,
  asyncWrap(async (req, res) => {
    const parsedBody = createNoteSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const { title, content, tags, color, isPinned } = parsedBody.data;
    const userId = (req.user as any)._id;

    // Process tags
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

    const newNote = await NoteModel.create({
      title,
      content,
      userId,
      tags: tagIds,
      color,
      isPinned,
    });

    const populatedNote = await newNote.populate("tags", "title");

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: populatedNote,
    });
  }),
);

// Get all notes for user
notesRouter.get(
  "/",
  protect,
  asyncWrap(async (req, res) => {
    const userId = (req.user as any)._id;

    const notes = await NoteModel.find({ userId })
      .populate("tags", "title")
      .sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  }),
);

// Get single note by ID
notesRouter.get(
  "/:noteId",
  protect,
  asyncWrap(async (req, res) => {
    const { noteId } = req.params;
    const userId = (req.user as any)._id;

    const note = await NoteModel.findOne({ _id: noteId, userId }).populate(
      "tags",
      "title",
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  }),
);

// Update note
notesRouter.put(
  "/:noteId",
  protect,
  asyncWrap(async (req, res) => {
    const { noteId } = req.params;
    const userId = (req.user as any)._id;

    const parsedBody = updateNoteSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const updateData = { ...parsedBody.data, updatedAt: new Date() };

    // Handle tags if provided
    if (parsedBody.data.tags && Array.isArray(parsedBody.data.tags)) {
      const tags = parsedBody.data.tags;
      let tagIds: Array<any> = [];

      if (tags.length > 0) {
        const cleaned = tags
          .map((t: string) => (t || "").trim())
          .filter(Boolean);
        const unique = Array.from(new Set(cleaned));

        const tagPromises = unique.map(async (tagTitle: string) => {
          const existing = await TagModel.findOne({ title: tagTitle });
          if (existing) return existing._id;
          const created = await TagModel.create({ title: tagTitle });
          return created._id;
        });

        tagIds = await Promise.all(tagPromises);
      }

      updateData.tags = tagIds;
    }

    const updatedNote = await NoteModel.findOneAndUpdate(
      { _id: noteId, userId },
      updateData,
      { new: true },
    ).populate("tags", "title");

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  }),
);

// Delete note
notesRouter.delete(
  "/:noteId",
  protect,
  asyncWrap(async (req, res) => {
    const { noteId } = req.params;
    const userId = (req.user as any)._id;

    const deletedNote = await NoteModel.findOneAndDelete({
      _id: noteId,
      userId,
    });

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  }),
);

// Toggle pin status
notesRouter.patch(
  "/:noteId/toggle-pin",
  protect,
  asyncWrap(async (req, res) => {
    const { noteId } = req.params;
    const userId = (req.user as any)._id;

    const note = await NoteModel.findOne({ _id: noteId, userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    note.isPinned = !note.isPinned;
    note.updatedAt = new Date();
    await note.save();

    const updatedNote = await note.populate("tags", "title");

    res.status(200).json({
      success: true,
      message: `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`,
      note: updatedNote,
    });
  }),
);

// Search notes
notesRouter.get(
  "/search/query",
  protect,
  asyncWrap(async (req, res) => {
    const userId = (req.user as any)._id;
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchRegex = new RegExp(q, "i");

    const notes = await NoteModel.find({
      userId,
      $or: [{ title: searchRegex }, { content: searchRegex }],
    })
      .populate("tags", "title")
      .sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  }),
);

export default notesRouter;
