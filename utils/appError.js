export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

const IfAppError = (condition, message, statusCode = 500) => {
  if (condition) throw new AppError(message, statusCode);
};

export default IfAppError;
