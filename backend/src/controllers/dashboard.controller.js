const dashboardService = require('../services/dashboard.service');
const { HTTP_STATUS } = require('../constants');

const getDashboard = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardData(req.user._id, req.user.role);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Dashboard data fetched successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
