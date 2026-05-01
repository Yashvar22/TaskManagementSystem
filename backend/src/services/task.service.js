const Task = require('../models/Task');
const Project = require('../models/Project');
const { createError } = require('../utils/helpers');
const { HTTP_STATUS, MESSAGES, TASK_STATUS } = require('../constants');

/**
 * Create a new task (admin only)
 */
const createTask = async ({ title, description, projectId, assignedTo, status, dueDate, createdBy }) => {
  // Verify project exists and user has access
  const project = await Project.findById(projectId);
  if (!project) {
    throw createError(MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  // Validate assignedTo is a project member
  if (assignedTo) {
    const isMember = project.members.some((m) => m.toString() === assignedTo);
    if (!isMember) {
      throw createError('Assigned user is not a member of this project', HTTP_STATUS.BAD_REQUEST);
    }
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo: assignedTo || null,
    status: status || TASK_STATUS.TODO,
    dueDate: dueDate || null,
    createdBy,
  });

  await task.populate('assignedTo', 'name email');
  await task.populate('createdBy', 'name email');

  return task;
};

/**
 * Get tasks for a project (must be a member)
 */
const getProjectTasks = async (projectId, userId, filters = {}) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw createError(MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const isMember = project.members.some((m) => m.toString() === userId.toString());
  if (!isMember) {
    throw createError(MESSAGES.PROJECT.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
  }

  const query = { projectId };
  if (filters.status) query.status = filters.status;
  if (filters.assignedTo) query.assignedTo = filters.assignedTo;

  const tasks = await Task.find(query)
    .populate('assignedTo', 'name email role')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  return tasks;
};

/**
 * Update task status (only assigned user or admin)
 */
const updateTask = async (taskId, updates, requestingUser) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw createError(MESSAGES.TASK.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const isAdmin = requestingUser.role === 'admin';
  const isAssigned =
    task.assignedTo && task.assignedTo.toString() === requestingUser._id.toString();

  if (!isAdmin && !isAssigned) {
    throw createError(MESSAGES.TASK.NOT_ASSIGNED, HTTP_STATUS.FORBIDDEN);
  }

  // Members can only update status
  if (!isAdmin) {
    const allowedUpdates = ['status'];
    const updateKeys = Object.keys(updates);
    const hasDisallowedUpdates = updateKeys.some((k) => !allowedUpdates.includes(k));
    if (hasDisallowedUpdates) {
      throw createError('Members can only update task status', HTTP_STATUS.FORBIDDEN);
    }
  }

  Object.assign(task, updates);
  await task.save();

  await task.populate('assignedTo', 'name email role');
  await task.populate('createdBy', 'name email');

  return task;
};

/**
 * Delete a task (admin only)
 */
const deleteTask = async (taskId) => {
  const task = await Task.findByIdAndDelete(taskId);
  if (!task) {
    throw createError(MESSAGES.TASK.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }
  return task;
};

module.exports = { createTask, getProjectTasks, updateTask, deleteTask };
