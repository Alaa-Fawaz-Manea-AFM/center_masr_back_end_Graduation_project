import { IfAppError, JwtVerify } from "../utils/index.js";

const Authentication = async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

  IfAppError(!token, "You are not logged in", 401);
  try {
    const { userId, profileId, role } = await JwtVerify(token);

    req.userId = userId;
    req.profileId = profileId;
    req.role = role;
  } catch (error) {
    IfAppError(
      true,
      "Your session has expired. Please refresh your token",
      401,
    );
  }

  next();
};

export default Authentication;
