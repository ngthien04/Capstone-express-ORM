import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../constants/app.constant.js";

/**
 * JWT Helper Functions
 */
export const jwtHelper = {
  /**
   * Tạo JWT token
   * @param {Object} payload - Data để encode vào token
   * @param {string} expiresIn - Thời gian hết hạn (default: 5h)
   * @returns {string} JWT token
   */
  createToken: (payload, expiresIn = JWT_CONFIG.EXPIRES_IN) => {
    if (!JWT_CONFIG.SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(payload, JWT_CONFIG.SECRET, { expiresIn });
  },

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token
   */
  verifyToken: (token) => {
    if (!JWT_CONFIG.SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.verify(token, JWT_CONFIG.SECRET);
  },

  /**
   * Decode JWT token (không verify)
   * @param {string} token - JWT token
   * @returns {Object} Decoded token
   */
  decodeToken: (token) => {
    return jwt.decode(token);
  },
};

