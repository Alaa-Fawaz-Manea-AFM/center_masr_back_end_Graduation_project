import { Router } from "express";
import { ADMIN, CENTER } from "../utils/index.js";
import {
  Authorize,
  longLimiter,
  Authentication,
  validationSchema,
} from "../middlware/index.js";
import {
  getWeeklySchedule,
  createWeeklySchedule,
  updateWeeklySchedule,
  deleteWeeklySchedule,
} from "../controller/weekly_schedule_controller.js";

const route = Router();

route.use(longLimiter());

route
  .route("/")
  .get(
    Authentication,
    validationSchema("body", "getLessons"),
    getWeeklySchedule,
  )
  .post(
    Authentication,
    validationSchema("body", "createWeeklySchedule"),
    Authorize(CENTER, ADMIN),
    createWeeklySchedule,
  );

route.use(Authentication, Authorize(CENTER, ADMIN));

route
  .route("/:id")
  .all(validationSchema("params", "id"))
  .patch(validationSchema("body", "updateWeeklySchedule"), updateWeeklySchedule)
  .delete(deleteWeeklySchedule);

export default route;
