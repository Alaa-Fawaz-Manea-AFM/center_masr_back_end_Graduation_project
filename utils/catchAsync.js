import logger from "./logger.js";

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    logger.error(err);
    next(err);
  });
};

export default catchAsync;
