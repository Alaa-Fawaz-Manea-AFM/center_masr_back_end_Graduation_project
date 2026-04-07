import { z } from "zod";
import { weekDays } from "../utils/constant.js";
import {
  cleanString,
  classRoomItemSchema,
  studyMaterialItemSchema,
} from "./index.js";

const daySet = new Set(weekDays);

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const dataDay = z.object({
  day: cleanString()
    .transform((val) => val.toLowerCase())
    .superRefine((item, ctx) => {
      if (!daySet.has(item)) {
        ctx.addIssue({
          message: `Invalid day: ${item}`,
        });
      }
    }),

  time: cleanString().refine((val) => timeRegex.test(val), {
    message: "time must be in format HH:mm (00:00 - 23:59)",
  }),

  teacherId: z.string().uuid(),

  studyMaterial: studyMaterialItemSchema,
});

// ==== Create Weekly Schema =====
const createWeeklySchema = z
  .object({
    classRoom: classRoomItemSchema,
    dataDays: z.array(dataDay).min(1).max(7),
  })
  .strip();

// ==== Update Weekly Schema =====
const updateWeeklySchema = dataDay.strip().omit({ day: true }).partial();

// ==== Get Lessons Schema =====
const getLessonsSchema = z
  .object({
    classRoom: classRoomItemSchema,
    centerId: z.string().uuid(),
  })
  .strip();

export { createWeeklySchema, updateWeeklySchema, getLessonsSchema };
