const sendResponsive = (res, statusCode, data, message, token) => {
  return res.status(statusCode).json({
    status: "success",
    data,
    token,
    message,
  });
};

export default sendResponsive;
