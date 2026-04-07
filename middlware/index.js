// import cacheRedis from "./cashe.middlware.js";
import Authorize from "./authorization.middleware.js";
import Authentication from "./authentication.middleware.js";
import validationSchema from "./validationSchema.middleware.js";
import preventSelfMiddleware from "./preventSelf.middleware.js";
import {
  globalLimiter,
  longLimiter,
  shortLimiter,
} from "./rateLimiter.middlware.js";
import {
  IsOwnerWithUserId,
  IsOwnerWithProfileId,
} from "./IsOwner.middlware.js";

export {
  Authorize,
  // cacheRedis,
  longLimiter,
  shortLimiter,
  globalLimiter,
  Authentication,
  validationSchema,
  IsOwnerWithUserId,
  IsOwnerWithProfileId,
  preventSelfMiddleware,
};
