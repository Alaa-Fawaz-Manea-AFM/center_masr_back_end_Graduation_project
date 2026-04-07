import { z } from "zod";
import {
  idSchema,
  roleSchema,
  signInSchema,
  signUpSchema,
  getLessonsSchema,
  updateUserSchema,
  updatePostSchema,
  createPostSchema,
  createLessonSchema,
  updateLessonSchema,
  createWeeklySchema,
  updateWeeklySchema,
  getAllLessonsSchema,
  createCommentSchema,
  updateCommentSchema,
  getAllUsersSchema,
} from "./index.js";
import querySchema from "./query.validation.js";
import { getAllpostsSchema } from "./post.validation.js";

const data = (type) => {
  const map = {
    id: idSchema,
    role: roleSchema,
    query: querySchema,
    login: signInSchema,
    signup: signUpSchema,
    getLessons: getLessonsSchema,
    createPost: createPostSchema,
    updatePost: updatePostSchema,
    updateUser: updateUserSchema,
    getAllpost: getAllpostsSchema,
    createLesson: createLessonSchema,
    updateLesson: updateLessonSchema,
    createComment: createCommentSchema,
    getAllUsers: getAllUsersSchema,
    updateComment: updateCommentSchema,
    getAllLessons: getAllLessonsSchema,
    createWeeklySchedule: createWeeklySchema,
    updateWeeklySchedule: updateWeeklySchema,
  };
  return map[type];
};

// const subscribeSchema = z.object({
//   type: z.literal("subscribe"),
//   matchId: z.string().min(1),
// });

// const unsubscribeSchema = z.object({
//   type: z.literal("unsubscribe"),
//   matchId: z.string().min(1),
// });

// export const wsMessageSchema = z.discriminatedUnion("type", [
//   subscribeSchema,
//   unsubscribeSchema,
// ]);

const schema = (key, type) => {
  const dataObject = { [key]: data(type) };

  return z.object(dataObject);
};

export default schema;
