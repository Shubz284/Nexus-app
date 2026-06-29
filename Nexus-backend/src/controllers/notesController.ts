import { Request, Response } from "express";
import * as z from "zod";
import { NoteModel, TagModel } from "../db.js";
import { createNoteSchema, updateNoteSchema } from "../schema/notesSchema.js";


function parseTagIds() {
  return async (tagTitle: string) => {
    const existing = await TagModel.findOne({ title: tagTitle });
    if (existing) return existing._id;
    const created = await TagModel.create({ title: tagTitle });
    return created._id;
  };
}

export async function createNote(req: Request, res: Response) {
  const parsedBody = createNoteSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      success: false,
      errors: parsedBody.error.flatten().fieldErrors,
    });
  }

  const { title, content, tags, color, isPinned } = parsedBody.data;
  const userId = (req.user as any)._id;

  let tagIds: Array<any> = [];
  if (Array.isArray(tags) && tags.length > 0) {
    const cleaned = tags.map((t: string) => (t || "").trim()).filter(Boolean);
    const unique = Array.from(new Set(cleaned));
    tagIds = await Promise.all(unique.map(parseTagIds()));
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
}

export async function getNotes(req: Request, res: Response) {
  const userId = (req.user as any)._id;

  const notes = await NoteModel.find({ userId })
    .populate("tags", "title")
    .sort({ isPinned: -1, updatedAt: -1 });

  res.status(200).json({ success: true, notes });
}

export async function getNoteById(req: Request, res: Response) {
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

  res.status(200).json({ success: true, note });
}

export async function updateNote(req: Request, res: Response) {
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

  if (parsedBody.data.tags && Array.isArray(parsedBody.data.tags)) {
    const tags = parsedBody.data.tags;
    let tagIds: Array<any> = [];

    if (tags.length > 0) {
      const cleaned = tags.map((t: string) => (t || "").trim()).filter(Boolean);
      const unique = Array.from(new Set(cleaned));
      tagIds = await Promise.all(unique.map(parseTagIds()));
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
}

export async function deleteNote(req: Request, res: Response) {
  const { noteId } = req.params;
  const userId = (req.user as any)._id;

  const deletedNote = await NoteModel.findOneAndDelete({ _id: noteId, userId });

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
}

export async function toggleNotePin(req: Request, res: Response) {
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
}

export async function searchNotes(req: Request, res: Response) {
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

  res.status(200).json({ success: true, notes });
}
