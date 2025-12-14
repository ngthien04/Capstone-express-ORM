import "dotenv/config";

/**
 * Application Constants
 */
export const APP_CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
};

/**
 * JWT Configuration
 */
export const JWT_CONFIG = {
  SECRET: process.env.SECRET || process.env.JWT_SECRET,
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || "5h",
};

/**
 * Database Configuration
 */
export const DATABASE_CONFIG = {
  URL: process.env.DATABASE_URL,
};

/**
 * File Upload Configuration
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 1000000, // 1MB
  ALLOWED_FILE_TYPES: ["image/jpeg", "image/png", "image/jpg", "image/gif"],
  UPLOAD_DIR: "public/img",
};

/**
 * Validation Regex
 */
export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10,11}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
};

/**
 * API Response Messages
 */
export const MESSAGES = {
  SUCCESS: "Success",
  FAIL: "Fail",
  ERROR: "Error",
  NOT_FOUND: "Not Found",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  BAD_REQUEST: "Bad Request",
  INTERNAL_ERROR: "Internal Server Error",
};

