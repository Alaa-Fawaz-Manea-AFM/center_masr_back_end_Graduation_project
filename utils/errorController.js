import { AppError } from "./appError.js";
import logger from "./logger.js";

const sendErrorDev = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message;

  res.status(statusCode).json({
    status,
    message,
  });
};

const sendErrorProd = (err, res) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";
  const message = err.message;

  if (err.isOperational) {
    return res.status(statusCode).json({
      status,
      message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went very wrong",
  });
};

// ===== Sequelize Handlers =====
const handleSequelizeValidation = (err) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.userId,
  });

  const message = err.errors.map((e) => e.message).join(", ");
  return new AppError(message, 400);
};

const handleSequelizeUnique = () => new AppError("Duplicate field value", 400);

const handleSequelizeForeignKey = () =>
  new AppError("Invalid reference ID (related data not found)", 400);

// ===== JWT Handlers =====
const handleJWTError = () => new AppError("Invalid token", 401);

const handleJWTExpired = () =>
  new AppError("Token expired, please login again", 401);

// ===== GLOBAL HANDLER =====
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // ===== JWT =====
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpired();

  // ===== Sequelize =====
  if (err.name === "SequelizeValidationError")
    error = handleSequelizeValidation(err);

  if (err.name === "SequelizeUniqueConstraintError")
    error = handleSequelizeUnique();

  if (err.name === "SequelizeForeignKeyConstraintError")
    error = handleSequelizeForeignKey();

  // ===== ENV =====
  if (process.env.NODE_ENV === "development") {
    return sendErrorDev(err, res);
  }

  sendErrorProd(error, res);
};

export default globalErrorHandler;
