import { Router } from "express";
import {
  shortLimiter,
  Authentication,
  validationSchema,
  preventSelfMiddleware,
} from "../middlware/index.js";
import toggleFollowUser from "../controller/followers_controller.js";

const route = Router();

route.use(shortLimiter(), Authentication);

route
  .route("/:id")
  .post(
    validationSchema("params", "id"),
    preventSelfMiddleware(),
    toggleFollowUser,
  );

export default route;
