import { Router } from "express";
import {
  getDiary,
  createDiary,
  updateDiary,
  deleteDiary,
  getAllDiaries,
} from "../controller/diary_controller.js";

const route = Router();

route.route("/").get(getAllDiaries);
route.route("/").post(createDiary);
route.route("/:id").get(getDiary);
route.route("/:id").patch(updateDiary);
route.route("/:id").delete(deleteDiary);

export default route;
