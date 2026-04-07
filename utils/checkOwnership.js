import IfAppError from "../utils/appError.js";

const checkOwnership = (userId, currentUserId) => {
  IfAppError(
    userId !== currentUserId,
    "You are not allowed to perform this action",
    403,
  );
};

export default checkOwnership;
