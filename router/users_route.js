import { Router } from "express";
import {
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../controller/users_controller.js";
import {
  longLimiter,
  Authentication,
  validationSchema,
  IsOwnerWithUserId,
  IsOwnerWithProfileId,
} from "../middlware/index.js";

const route = Router();

route.use(longLimiter(), Authentication);

route
  .route("/")
  .get(
    validationSchema("query", "query"),
    validationSchema("body", "getAllUsers"),
    getAllUsers,
  );

route.route("/my-profile").get(getAllUsers);

route
  .route("/:id")
  .all(validationSchema("params", "id"))
  .get(validationSchema("body", "role"), getUser)
  .patch(
    validationSchema("body", "updateUser"),
    IsOwnerWithUserId,
    // IsOwnerWithProfileId,
    updateUser,
  )
  .delete(IsOwnerWithUserId, deleteUser);

export default route;
