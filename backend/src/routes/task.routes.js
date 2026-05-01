const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { ROLES, TASK_STATUS } = require('../constants');

// All routes require authentication
router.use(authenticate);

// @route  POST /api/tasks
// @desc   Create a new task (admin only)
// @access Private/Admin
router.post(
  '/',
  authorize(ROLES.ADMIN),
  [
    body('title').trim().notEmpty().withMessage('Task title is required').isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('projectId').notEmpty().withMessage('Project ID is required').isMongoId().withMessage('Invalid project ID'),
    body('description').optional().isLength({ max: 1000 }).withMessage('Description max 1000 chars'),
    body('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
    body('status').optional().isIn(Object.values(TASK_STATUS)).withMessage('Invalid status'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  taskController.createTask
);

// @route  GET /api/tasks?projectId=
// @desc   Get tasks for a project
// @access Private (members only)
router.get('/', taskController.getTasks);

// @route  PUT /api/tasks/:id
// @desc   Update a task (assigned user or admin)
// @access Private
router.put(
  '/:id',
  [
    body('status').optional().isIn(Object.values(TASK_STATUS)).withMessage('Invalid status'),
    body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ],
  validate,
  taskController.updateTask
);

// @route  DELETE /api/tasks/:id
// @desc   Delete a task (admin only)
// @access Private/Admin
router.delete('/:id', authorize(ROLES.ADMIN), taskController.deleteTask);

module.exports = router;
