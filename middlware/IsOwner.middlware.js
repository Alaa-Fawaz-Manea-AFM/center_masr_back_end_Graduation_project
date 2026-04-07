import { checkOwnership } from "../utils/index.js";

const IsOwnerWithUserId = (req, res, next) => {
  checkOwnership(req?.validatedData?.params?.id, req?.userId);
  next();
};

const IsOwnerWithProfileId = (req, res, next) => {
  checkOwnership(req?.validatedData?.params?.id, req?.profileId);
  next();
};

export { IsOwnerWithUserId, IsOwnerWithProfileId };
