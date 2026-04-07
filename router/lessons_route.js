import { Router } from "express";
import { ADMIN, TEACHER } from "../utils/index.js";
import {
  Authorize,
  longLimiter,
  Authentication,
  validationSchema,
  IsOwnerWithProfileId,
} from "../middlware/index.js";
import {
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson,
  getAllLessons,
} from "../controller/lessons_controller.js";

const route = Router();

route.use(longLimiter());

route
  .route("/")
  .get(
    validationSchema("query", "query"),
    validationSchema("body", "getAllLessons"),
    getAllLessons,
  );
route.route("/:id").get(validationSchema("params", "id"), getLesson);

route.use(Authentication);

route
  .route("/")
  .post(
    validationSchema("body", "createLesson"),
    Authorize(TEACHER, ADMIN),
    createLesson,
  );
route
  .route("/:id")
  .all(validationSchema("params", "id"), Authorize(TEACHER, ADMIN))

  .patch(validationSchema("body", "updateLesson"), updateLesson)
  .delete(IsOwnerWithProfileId, deleteLesson);

export default route;
