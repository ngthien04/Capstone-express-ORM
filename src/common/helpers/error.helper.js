import { responseError } from "./response.helper.js";

/**
 * Error handling middleware
 */
export const handleError = (err, req, res, next) => {
  const statusCode = err.code || err.status || 500;
  const message = err.message || "Internal Server Error";

  const resData = responseError(statusCode, message, err.stack);
  res.status(resData.code).json(resData);
};

/**
 * Custom Exception Classes
 */
export class BadRequestException extends Error {
  constructor(message = "Bad Request") {
    super(message);
    this.code = 400;
    this.status = 400;
  }
}

export class UnauthorizedException extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.code = 401;
    this.status = 401;
  }
}

export class ForbiddenException extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.code = 403;
    this.status = 403;
  }
}

export class NotFoundException extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.code = 404;
    this.status = 404;
  }
}

export class ConflictException extends Error {
  constructor(message = "Conflict") {
    super(message);
    this.code = 409;
    this.status = 409;
  }
}

export class InternalServerException extends Error {
  constructor(message = "Internal Server Error") {
    super(message);
    this.code = 500;
    this.status = 500;
  }
}

