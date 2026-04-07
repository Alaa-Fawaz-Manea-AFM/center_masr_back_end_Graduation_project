import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const shortMax = 50;
const longMax = 150;

const shortWindowMs = 2 * 60 * 1000;
const longWindowMs = 5 * 60 * 1000;
const globalWindow = 15 * 60 * 1000;

const limiters = (windowMs, max) =>
  rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: "Too many verification requests. Try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,

    handler: (req, res, next, options) => {
      res.status(429).json({
        success: false,
        message: "Limit exceeded. Try again later.",
        retryAfter: Math.ceil(options.windowMs / 1000) + " seconds",
      });
    },

    keyGenerator: (req) => {
      if (req.headers["x-api-key"]) return req.headers["x-api-key"];
      return ipKeyGenerator(req.ip);
    },
  });

const shortLimiter = (max = shortMax, windowMs = shortWindowMs) =>
  limiters(windowMs, max);

const longLimiter = (max = longMax, windowMs = longWindowMs) =>
  limiters(windowMs, max);

const globalLimiter = limiters(globalWindow, longMax);

export { globalLimiter, longLimiter, shortLimiter };
