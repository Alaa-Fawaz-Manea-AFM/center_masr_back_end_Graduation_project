import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import sequelize from "./config/database.js";
import homeRouter from "./router/home_router.js";
import router from "./router/index.js";
import logger from "./utils/logger.js";
import { CLIENT_URL, HOST, NODE_ENV, PORT } from "./config/ENV.js";
import { globalLimiter } from "./middlware/rateLimiter.middlware.js";
import globalErrorHandler from "./utils/errorController.js";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import { nanoid } from "nanoid";

const app = express();

// ===================== Security Middlewares ===================== //

app.use((req, res, next) => {
  res.locals.nonce = nanoid();
  next();
});
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS
const allowedOrigins =
  NODE_ENV === "production"
    ? [CLIENT_URL]
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Rate limiting
app.use("/api/v1", globalLimiter);

// ===================== Body Parsing ===================== //
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===================== Logging ===================== //
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (msg) => logger.info(msg.trim()) },
    }),
  );
}

// ===================== Routes ===================== //

// routes/home.js
app.use("/", homeRouter);

app.use("/api/v1", router);

// ===================== 404 Handler ===================== //
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} not found`,
  });
});

// ===================== Global Error Handler ===================== //
app.use(globalErrorHandler);

// ===================== DB Sync ===================== //
if (NODE_ENV === "production") {
  sequelize
    .authenticate()
    .then(() => logger.info("Database connected"))
    .catch((err) => logger.error("DB connection failed", err));
} else {
  sequelize
    .sync({ alter: true, force: false })
    .catch((err) => logger.error("DB sync failed", err));
}

// ===================== Server ===================== //
app.listen(PORT, HOST, () => {
  logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

// ===================== Graceful Shutdown ===================== //
const shutdown = async () => {
  logger.info("Shutting down gracefully...");
  await sequelize.close();
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
};

process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception:", err);
  shutdown();
});
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled Rejection:", err);
  shutdown();
});
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default app;
