import * as z from "zod"

export const createDocumentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  isPinned: z.boolean().optional().default(false),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPinned: z.boolean().optional(),
});