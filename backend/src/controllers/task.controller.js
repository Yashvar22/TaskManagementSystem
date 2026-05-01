const taskService = require('../services/task.service');
const { HTTP_STATUS } = require('../constants');

const createTask = async (req, res, next) => {
  try {
    const { title, description, projectId, assignedTo, status, dueDate } = req.body;
    const task = await taskService.createTask({
      title,
      description,
      projectId,
      assignedTo,
      status,
      dueDate,
      createdBy: req.user._id,
    });
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { projectId, status, assignedTo } = req.query;
    if (!projectId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'projectId query parameter is required',
      });
    }
    const tasks = await taskService.getProjectTasks(projectId, req.user._id, {
      status,
      assignedTo,
    });
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Tasks fetched successfully',
      data: { tasks },
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body, req.user);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Task updated successfully',
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
