import "dotenv/config";

export const {
  NODE_ENV = "development",
  HOST,
  PORT = 3000,
  DB_USERNAME,
  DB_PASSWORD,
  JWT_ISSUER,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_DIALECT,
  DB_SSL = "true",
  CLIENT_URL,
  REDIS_PORT,
  REDIS_HOST,
  COOKIE_DOMAIN,
  JWT_SECRET_KEY,
  JWT_EXPIRES_IN = "15m",
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_EXPIRES_IN = "7d",
} = process.env;
