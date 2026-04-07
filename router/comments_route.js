import { Router } from "express";
import {
  longLimiter,
  Authentication,
  validationSchema,
} from "../middlware/index.js";
import {
  // getComment,
  createComment,
  updateComment,
  deleteComment,
  getAllComments,
} from "../controller/comments_controller.js";

const route = Router();

route.use(longLimiter(), Authentication);

route
  .route("/")
  .get(
    validationSchema("query", "query"),
    validationSchema("body", "id"),
    getAllComments,
  )
  .post(validationSchema("body", "createComment"), createComment);
route
  .route("/:id")
  .all(validationSchema("params", "id"))
  .patch(validationSchema("body", "updateComment"), updateComment)
  .delete(deleteComment);
// .get(getComment)

export default route;
