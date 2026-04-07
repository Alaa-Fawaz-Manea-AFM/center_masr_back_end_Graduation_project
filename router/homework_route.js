import { Router } from "express";
import {
  getAllHomeworks,
  createHomework,
  updateHomework,
  deleteHomework,
  getHomework,
} from "../controller/homework_controller.js";

const route = Router();

route.route("/").get(getAllHomeworks);
route.route("/").post(createHomework);
route.route("/:id").get(getHomework);
route.route("/:id").patch(updateHomework);
route.route("/:id").delete(deleteHomework);

export default route;
