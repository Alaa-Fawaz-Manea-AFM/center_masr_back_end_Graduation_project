import Redis from "ioredis";

const redis = new Redis();

export const rateLimitRedis = (limit = 10, window = 60) => {
  return async (req, res, next) => {
    const key = `rate:${req.ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, window);
    }

    if (current > limit) {
      return res.status(429).json({
        success: false,
        status: "fail",
        message: "Too many requests",
      });
    }

    next();
  };
};
