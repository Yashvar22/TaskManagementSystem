const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token
 * @param {string} id - User ID
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Build standardized API response
 * @param {boolean} success
 * @param {string} message
 * @param {*} data
 * @returns {object}
 */
const buildResponse = (success, message, data = null) => {
  const response = { success, message };
  if (data !== null) response.data = data;
  return response;
};

/**
 * Create a custom application error with status code
 * @param {string} message
 * @param {number} statusCode
 */
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { generateToken, buildResponse, createError };
