import jwt from "jsonwebtoken";
import {
  NODE_ENV,
  JWT_ISSUER,
  COOKIE_DOMAIN,
  JWT_EXPIRES_IN,
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN,
} from "../config/ENV.js";

// ---------------- Secure Cookie Options ----------------
const cookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/v1",
  // domain: COOKIE_DOMAIN,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const refreshCookieOptions = {
  ...cookieOptions,
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const JwtSign = (userId, profileId, role, type = "access") => {
  const { secret_key, expiresIn } =
    type === "refresh"
      ? {
          secret_key: JWT_REFRESH_SECRET_KEY,
          expiresIn: JWT_REFRESH_EXPIRES_IN,
        }
      : {
          secret_key: JWT_SECRET_KEY,
          expiresIn: JWT_EXPIRES_IN,
        };

  return jwt.sign({ userId, profileId, role }, secret_key, {
    expiresIn,
    issuer: JWT_ISSUER,
  });
};

const JwtVerify = (token, type = "access") => {
  const secret_key =
    type === "refresh" ? JWT_REFRESH_SECRET_KEY : JWT_SECRET_KEY;
  return jwt.verify(token, secret_key, {
    issuer: JWT_ISSUER,
  });
};

export { JwtSign, JwtVerify, refreshCookieOptions, cookieOptions };
