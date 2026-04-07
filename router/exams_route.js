import { Router } from "express";
import {
  getAllExams,
  createExam,
  updateExam,
  deleteExam,
  getExam,
} from "../controller/exams_controller.js";

const route = Router();

route.route("/").get(getAllExams);
route.route("/").post(createExam);
route.route("/:id").get(getExam);
route.route("/:id").patch(updateExam);
route.route("/:id").delete(deleteExam);

export default route;
