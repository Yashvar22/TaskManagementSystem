const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { ROLES } = require('../constants');

// All routes require authentication
router.use(authenticate);

// @route  POST /api/projects
// @desc   Create a new project (admin only)
// @access Private/Admin
router.post(
  '/',
  authorize(ROLES.ADMIN),
  [
    body('name').trim().notEmpty().withMessage('Project name is required').isLength({ min: 3 }).withMessage('Project name must be at least 3 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
  ],
  validate,
  projectController.createProject
);

// @route  GET /api/projects
// @desc   Get all projects for current user
// @access Private
router.get('/', projectController.getProjects);

// @route  GET /api/projects/:id
// @desc   Get project by ID
// @access Private (members only)
router.get('/:id', projectController.getProjectById);

// @route  POST /api/projects/:id/add-member
// @desc   Add a member to a project (admin only)
// @access Private/Admin
router.post(
  '/:id/add-member',
  authorize(ROLES.ADMIN),
  [body('email').isEmail().withMessage('Provide a valid member email').normalizeEmail()],
  validate,
  projectController.addMember
);

module.exports = router;
