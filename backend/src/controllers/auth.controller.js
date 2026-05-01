const authService = require('../services/auth.service');
const { HTTP_STATUS } = require('../constants');

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const { user, token } = await authService.signup({ name, email, password, role });
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Account created successfully',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successful',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'User profile fetched',
    data: { user: req.user },
  });
};

module.exports = { signup, login, getMe };
