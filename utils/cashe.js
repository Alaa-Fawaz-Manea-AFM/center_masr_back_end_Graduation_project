import Redis from "ioredis";

// وفي middleware:
// const isBlacklisted = await redis.get(`blacklist:${token}`);
// if (isBlacklisted) throw new Error("Token revoked");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

export const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key, value, ttl = 60) => {
  await redis.set(key, JSON.stringify(value), "EX", ttl);
};

export const deleteCache = async (key) => {
  await redis.del(key);
};
import { getCache, setCache } from "../utils/cache.js";

await deleteCache("posts:*"); // أو smart keys
await deleteCache(`posts:userId:${userId}`);
// posts:userId:123
// posts:feed:student:page1

// get all posts
export const getPostsService = async (params) => {
  const cacheKey = `posts:${JSON.stringify(params)}`;

  //  1. check cache
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  // 2. query DB
  const result = await fetchPostsFromDB(params);

  // 3. save cache
  await setCache(cacheKey, result, 60);

  return result;
};

// rate limit redis

export const rateLimitRedis = (limit = 10, window = 60) => {
  return async (req, res, next) => {
    const key = `rate:${req.ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, window);
    }

    if (current > limit) {
      return res.status(429).json({
        status: "fail",
        message: "Too many requests",
      });
    }

    next();
  };
};

// ✅ 3. Session / Token Blacklist

// لو عايز تعمل:

// logout all devices
// revoke tokens

await redis.set(`blacklist:${token}`, true, "EX", 3600);
