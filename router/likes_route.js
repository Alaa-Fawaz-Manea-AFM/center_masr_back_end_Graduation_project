import { Router } from "express";
import toggleLike from "../controller/likes_controller.js";
import {
  shortLimiter,
  Authentication,
  validationSchema,
} from "../middlware/index.js";

const route = Router();

route.use(shortLimiter(), Authentication);

route.route("/:id").post(validationSchema("params", "id"), toggleLike);

export default route;
