import * as z from "zod"

export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  color: z.string().optional().default("bg-yellow-100"),
  isPinned: z.boolean().optional().default(false),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
  isPinned: z.boolean().optional(),
});