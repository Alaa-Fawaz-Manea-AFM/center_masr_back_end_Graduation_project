import { z } from "zod";
import {
  cleanString,
  classRoomItemSchema,
  studyMaterialItemSchema,
} from "./user.validation.js";

const videoUrlRegex =
  /^https?:\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?.*\.(mp4|mov|avi|webm)$/i;

// ✅ ===== Create Lesson Schema =====
const createLessonSchema = z
  .object({
    title: cleanString()
      .min(3, "title must be at least 3 characters")
      .max(100, "title must be less than 100 characters"),

    classRoom: classRoomItemSchema,

    studyMaterial: studyMaterialItemSchema,

    description: cleanString()
      .min(3, "description must be at least 3 characters")
      .max(500, "description must be less than 500 characters"),

    vedioUrl: cleanString()
      .url("Invalid URL")
      .refine((url) => !url || videoUrlRegex.test(url), {
        message:
          "vedioUrl must be a valid https URL ending with .mp4, .mov, .avi, or .webm",
      })
      .optional(),
  })
  .strip();

// ✅ ===== Update Lesson Schema =====
const updateLessonSchema = createLessonSchema.partial();

// ✅ ===== Get All Lessons Schema =====
const getAllLessonsSchema = z
  .object({
    teacherId: z.string().uuid(),

    classRoom: classRoomItemSchema,
    studyMaterial: studyMaterialItemSchema,
  })
  .strip();

export { createLessonSchema, updateLessonSchema, getAllLessonsSchema };
