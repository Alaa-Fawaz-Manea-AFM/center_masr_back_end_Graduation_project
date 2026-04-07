import { IfAppError } from "../utils/index.js";

const Authorize =
  (...roles) =>
  (req, res, next) => {
    IfAppError(
      !roles.includes(req.role),
      "You are not authorized to perform this action",
      403,
    );

    next();
  };

export default Authorize;
