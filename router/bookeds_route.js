import { Router } from "express";
import { ADMIN, STUDENT } from "../utils/index.js";
import {
  // getAllBookeds,
  toggleBookedStudent,
} from "../controller/bookeds_controller.js";
import {
  Authentication,
  Authorize,
  shortLimiter,
  validationSchema,
} from "../middlware/index.js";

const route = Router();

route.use(shortLimiter(), Authentication);

route
  .route("/:id")
  // .get(getAllBookeds)
  .post(
    validationSchema("params", "id"),
    Authorize(STUDENT, ADMIN),
    toggleBookedStudent,
  );

export default route;
