import { z } from "zod";
import { roleItemSchema } from "./user.validation.js";

// ✅ ===== Create Post Schema =====
const createPostSchema = z
  .object({
    title: z
      .string({ required_error: "title is required" })
      .trim()
      .min(3, "title must be at least 3 characters")
      .max(100, "title must be less than 100 characters"),
    content: z
      .string({ required_error: "content is required" })
      .trim()
      .min(3, "content must be at least 3 characters")
      .max(500, "content must be less than 500 characters"),
    imageUrl: z.string().trim().url("imageUrl must be a valid URL").optional(),
  })
  .strip();

// ✅ ===== Update Post Schema =====
const updatePostSchema = createPostSchema.partial();

const getAllpostsSchema = z
  .object({
    userId: z.string().uuid(),
    role: roleItemSchema,
  })
  .strip();

export { createPostSchema, updatePostSchema, getAllpostsSchema };
