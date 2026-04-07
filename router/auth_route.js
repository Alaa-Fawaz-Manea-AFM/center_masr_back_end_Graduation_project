import { Router } from "express";
import {
  shortLimiter,
  Authentication,
  validationSchema,
} from "../middlware/index.js";
import {
  signUp,
  logIn,
  logOut,
  refreshTokenHandler,
} from "../controller/auth_controller.js";

const route = Router();

route.use(shortLimiter());

route.route("/signup").post(validationSchema("body", "signup"), signUp);
route.route("/login").post(validationSchema("body", "login"), logIn);
route.route("/logout").post(Authentication, logOut);
route.post("/refresh-token", refreshTokenHandler);

export default route;
