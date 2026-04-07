import { createPostSchema, updatePostSchema } from "./post.validation.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "./comment.validation.js";
import {
  createLessonSchema,
  updateLessonSchema,
  getAllLessonsSchema,
} from "./lesson.validation.js";
import {
  getLessonsSchema,
  createWeeklySchema,
  updateWeeklySchema,
} from "./weekly.validation.js";
import {
  idSchema,
  roleSchema,
  cleanString,
  classRoomSet,
  getAllUsersSchema,
  signInSchema,
  signUpSchema,
  studyMaterialSet,
  updateUserSchema,
  classRoomItemSchema,
  studyMaterialItemSchema,
} from "./user.validation.js";

import schema from "./zod.schema.js";

export {
  createCommentSchema,
  updateCommentSchema,
  getAllLessonsSchema,
  createLessonSchema,
  updateLessonSchema,
  getLessonsSchema,
  createPostSchema,
  updatePostSchema,
  cleanString,
  schema,
  idSchema,
  getAllUsersSchema,
  classRoomItemSchema,
  roleSchema,
  signInSchema,
  signUpSchema,
  classRoomSet,
  studyMaterialSet,
  updateUserSchema,
  createWeeklySchema,
  updateWeeklySchema,
  studyMaterialItemSchema,
};
