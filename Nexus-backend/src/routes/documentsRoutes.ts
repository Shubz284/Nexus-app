import express, { Request, Response } from "express";
import passport from "passport";
import * as z from "zod";
import { DocumentModel, TagModel } from "../db.js";
import { asyncWrap } from "../utils/asyncWrap.js";
import { uploadMiddleware } from "../utils/fileUpload.js";
import fs from "fs";
import path from "path";

const documentsRouter = express.Router();

const protect = passport.authenticate("jwt-access", { session: false });

// Zod validation schemas
const createDocumentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  isPinned: z.boolean().optional().default(false),
});

const updateDocumentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
});

// Upload a new document
documentsRouter.post(
  "/",
  protect,
  uploadMiddleware.single("document"),
  asyncWrap(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const parsedBody = createDocumentSchema.safeParse(req.body);

    if (!parsedBody.success) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        errors: parsedBody.error.flatten().fieldErrors,
      });
    }

    const { title, description, tags, isPinned } = parsedBody.data;
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
  }),
);

// Get all documents for user
documentsRouter.get(
  "/",
  protect,
  asyncWrap(async (req, res) => {
    const userId = (req.user as any)._id;

    const documents = await DocumentModel.find({ userId })
      .populate("tags", "title")
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      documents,
    });
  }),
);

// Get single document by ID
documentsRouter.get(
  "/:documentId",
  protect,
  asyncWrap(async (req, res) => {
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

    res.status(200).json({
      success: true,
      document,
    });
  }),
);

// Update document
documentsRouter.put(
  "/:documentId",
  protect,
  asyncWrap(async (req, res) => {
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
  }),
);

// Delete document
documentsRouter.delete(
  "/:documentId",
  protect,
  asyncWrap(async (req, res) => {
    const { documentId } = req.params;
    const userId = (req.user as any)._id;

    const document = await DocumentModel.findOne({ _id: documentId, userId });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete file from disk
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
  }),
);

// Toggle pin status
documentsRouter.patch(
  "/:documentId/toggle-pin",
  protect,
  asyncWrap(async (req, res) => {
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
  }),
);

// Search documents
documentsRouter.get(
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

    res.status(200).json({
      success: true,
      documents,
    });
  }),
);

export default documentsRouter;
