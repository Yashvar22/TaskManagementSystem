const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');

// @route  GET /api/dashboard
// @desc   Get aggregated dashboard data
// @access Private
router.get('/', authenticate, dashboardController.getDashboard);

module.exports = router;
