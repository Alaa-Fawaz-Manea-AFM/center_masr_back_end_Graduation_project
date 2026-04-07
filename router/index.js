import express from "express";

import userRouter from "./users_route.js";
import authRouter from "./auth_route.js";
import postRouter from "./posts_route.js";
import likeRouter from "./likes_route.js";
import lessonRouter from "./lessons_route.js";
import commentRouter from "./comments_route.js";
import followRouter from "./followers_route.js";
import weekly_Days from "./weekly_Days_route.js";
import bookeds from "./bookeds_route.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/likes", likeRouter);
router.use("/comments", commentRouter);
router.use("/followers", followRouter);
router.use("/lessons", lessonRouter);
router.use("/weeklys", weekly_Days);
router.use("/bookeds", bookeds);

export default router;
