const AppError = require("../utils/appError");

const handleDuplicateFieldDB = (err) => {
  const value = err.message.split("{")[1].split(":")[0].trim();

  const message = `Duplicate field value: ${value}, please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join(". ")}`;

  return new AppError(message, 400);
};

const handleJsonWebTokenError = (err) =>
  new AppError("Invalid token! Please login again.", 401);

const handleJwtTokenExpiredError = (err) =>
  new AppError("Session timeout, please login again", 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted Error: send message to client.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details to client.
  } else {
    // Log error
    console.error("Error 💥", err);

    // Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError")
      error = handleJsonWebTokenError(error);
    if (error.name === "TokenExpiredError")
      error = handleJwtTokenExpiredError(error);

    sendErrorProd(error, res);
  }
};
