import { z } from "zod";

const createCommentSchema = z
  .object({
    postId: z.string().uuid(),
    content: z
      .string({ required_error: "content is required" })
      .trim()
      .min(3, "content must be at least 3 characters")
      .max(500, "content must be less than 500 characters"),
  })
  .strip();

const updateCommentSchema = createCommentSchema.partial().strip();

export { createCommentSchema, updateCommentSchema };
