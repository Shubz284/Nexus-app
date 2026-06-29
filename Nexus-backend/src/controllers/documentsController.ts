import { Request, Response } from "express";
import * as z from "zod";
import fs from "fs";
import path from "path";
import { DocumentModel, TagModel } from "../db.js";
import { createDocumentSchema, updateDocumentSchema } from "../schema/docsSchema.js";


function parseTagIds(tags: string[]) {
  return async (tagTitle: string) => {
    const existing = await TagModel.findOne({ title: tagTitle });
    if (existing) return existing._id;
    const created = await TagModel.create({ title: tagTitle });
    return created._id;
  };
}

export async function createDocument(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  const parsedBody = createDocumentSchema.safeParse(req.body);
  if (!parsedBody.success) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({
      success: false,
      errors: parsedBody.error.flatten().fieldErrors,
    });
  }

  const { title, description, tags, isPinned } = parsedBody.data;
  const userId = (req.user as any)._id;

  let tagIds: Array<any> = [];
  if (Array.isArray(tags) && tags.length > 0) {
    const cleaned = tags.map((t: string) => (t || "").trim()).filter(Boolean);
    const unique = Array.from(new Set(cleaned));
    tagIds = await Promise.all(unique.map(parseTagIds(tags)));
  }

  const newDocument = await DocumentModel.create({
    title,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    userId,
    tags: tagIds,
    description,
    isPinned,
  });

  const populatedDocument = await newDocument.populate("tags", "title");

  res.status(201).json({
    success: true,
    message: "Document uploaded successfully",
    document: populatedDocument,
  });
}

export async function getDocuments(req: Request, res: Response) {
  const userId = (req.user as any)._id;

  const documents = await DocumentModel.find({ userId })
    .populate("tags", "title")
    .sort({ isPinned: -1, createdAt: -1 });

  res.status(200).json({ success: true, documents });
}

export async function getDocumentById(req: Request, res: Response) {
  const { documentId } = req.params;
  const userId = (req.user as any)._id;

  const document = await DocumentModel.findOne({
    _id: documentId,
    userId,
  }).populate("tags", "title");

  if (!document) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
    });
  }

  res.status(200).json({ success: true, document });
}

export async function updateDocument(req: Request, res: Response) {
  const { documentId } = req.params;
  const userId = (req.user as any)._id;

  const parsedBody = updateDocumentSchema.safeParse(req.body);
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
      tagIds = await Promise.all(unique.map(parseTagIds(tags)));
    }

    updateData.tags = tagIds;
  }

  const updatedDocument = await DocumentModel.findOneAndUpdate(
    { _id: documentId, userId },
    updateData,
    { new: true },
  ).populate("tags", "title");

  if (!updatedDocument) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Document updated successfully",
    document: updatedDocument,
  });
}

export async function deleteDocument(req: Request, res: Response) {
  const { documentId } = req.params;
  const userId = (req.user as any)._id;

  const document = await DocumentModel.findOne({ _id: documentId, userId });
  if (!document) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
    });
  }

  const filename =
    typeof document.filename === "string" ? document.filename : "";
  if (filename) {
    const filePath = path.join(process.cwd(), "uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await DocumentModel.deleteOne({ _id: documentId, userId });

  res.status(200).json({
    success: true,
    message: "Document deleted successfully",
  });
}

export async function toggleDocumentPin(req: Request, res: Response) {
  const { documentId } = req.params;
  const userId = (req.user as any)._id;

  const document = await DocumentModel.findOne({ _id: documentId, userId });

  if (!document) {
    return res.status(404).json({
      success: false,
      message: "Document not found",
    });
  }

  document.isPinned = !document.isPinned;
  document.updatedAt = new Date();
  await document.save();

  const updatedDocument = await document.populate("tags", "title");

  res.status(200).json({
    success: true,
    message: `Document ${document.isPinned ? "pinned" : "unpinned"} successfully`,
    document: updatedDocument,
  });
}

export async function searchDocuments(req: Request, res: Response) {
  const userId = (req.user as any)._id;
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  const searchRegex = new RegExp(q, "i");

  const documents = await DocumentModel.find({
    userId,
    $or: [
      { title: searchRegex },
      { description: searchRegex },
      { originalName: searchRegex },
    ],
  })
    .populate("tags", "title")
    .sort({ isPinned: -1, createdAt: -1 });

  res.status(200).json({ success: true, documents });
}
