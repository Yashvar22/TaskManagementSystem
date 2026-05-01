const projectService = require('../services/project.service');
const { HTTP_STATUS } = require('../constants');

const createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const project = await projectService.createProject({
      name,
      description,
      createdBy: req.user._id,
    });
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Project created successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getUserProjects(req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Projects fetched successfully',
      data: { projects },
    });
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.params.id, req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Project fetched successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { email } = req.body;
    const project = await projectService.addMember(req.params.id, email, req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Member added successfully',
      data: { project },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProject, getProjects, getProjectById, addMember };
