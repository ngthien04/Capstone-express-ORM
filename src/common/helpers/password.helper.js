import bcryptjs from "bcryptjs";

/**
 * Password Helper Functions
 */
export const passwordHelper = {
  /**
   * Hash password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  hash: async (password) => {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
  },

  /**
   * Compare password với hash
   * @param {string} plainPassword - Plain text password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} True nếu match
   */
  compare: async (plainPassword, hashedPassword) => {
    return await bcryptjs.compare(plainPassword, hashedPassword);
  },
};

