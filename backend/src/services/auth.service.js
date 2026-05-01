const User = require('../models/User');
const { generateToken, createError } = require('../utils/helpers');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Register a new user
 * @param {object} userData - { name, email, password, role }
 * @returns {{ user, token }}
 */
const signup = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createError(MESSAGES.AUTH.EMAIL_EXISTS, HTTP_STATUS.CONFLICT);
  }

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user._id);

  return { user, token };
};

/**
 * Authenticate an existing user
 * @param {string} email
 * @param {string} password
 * @returns {{ user, token }}
 */
const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw createError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw createError(MESSAGES.AUTH.INVALID_CREDENTIALS, HTTP_STATUS.UNAUTHORIZED);
  }

  const token = generateToken(user._id);

  // Remove password from returned user object
  const userObj = user.toJSON();
  return { user: userObj, token };
};

module.exports = { signup, login };
