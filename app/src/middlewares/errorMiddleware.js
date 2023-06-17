const mongoose = require("mongoose");
const { AxiosError } = require("axios");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const errorConverter = (err, req, res, next) => {
  let error = err;
  if (error instanceof AxiosError && error.response?.data) {
    const response = error.response.data;
    error = new ApiError(
      response.code ?? err.response.status,
      response.message,
      response.errors
    );
  } else if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message);
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  };

  if (err.errors) response.errors = err.errors;

  res.status(statusCode).send(response);
};

const notFoundErrorHandler = (req, res, next) => {
  const error = new ApiError(httpStatus.NOT_FOUND, "Not found");
  next(error);
};

module.exports = {
  errorHandler,
  errorConverter,
  notFoundErrorHandler,
};
