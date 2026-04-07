import { IfAppError } from "../utils/index.js";

const preventSelfMiddleware =
  (key = "id") =>
  (req, res, next) => {
    const targetId = req?.validatedData?.params?.id;
    const userId = req.userId;

    IfAppError(targetId === userId, "You can't perform this on yourself", 403);

    next();
  };

export default preventSelfMiddleware;
