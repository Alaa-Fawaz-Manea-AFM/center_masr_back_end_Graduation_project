import { Router } from "express";
import { CENTER, TEACHER, ADMIN } from "../utils/index.js";
import {
  Authorize,
  longLimiter,
  Authentication,
  validationSchema,
} from "../middlware/index.js";
import {
  getPost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controller/posts_controller.js";

const route = Router();

route.use(longLimiter(), Authentication);

route
  .route("/")
  .get(
    validationSchema("query", "query"),
    validationSchema("body", "getAllpost"),
    getAllPosts,
  )
  .post(
    validationSchema("body", "createPost"),
    Authorize(CENTER, TEACHER, ADMIN),
    createPost,
  );

route
  .route("/:id")
  .all(validationSchema("params", "id"))
  .get(getPost)

  .all(Authorize(CENTER, TEACHER, ADMIN))
  .patch(validationSchema("body", "updatePost"), updatePost)
  .delete(deletePost);

export default route;
