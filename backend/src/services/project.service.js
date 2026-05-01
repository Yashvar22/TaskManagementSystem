const Project = require('../models/Project');
const User = require('../models/User');
const { createError } = require('../utils/helpers');
const { HTTP_STATUS, MESSAGES } = require('../constants');

/**
 * Create a new project (admin only)
 */
const createProject = async ({ name, description, createdBy }) => {
  const project = await Project.create({ name, description, createdBy });
  await project.populate('members', 'name email role');
  return project;
};

/**
 * Get all projects where user is a member
 */
const getUserProjects = async (userId) => {
  const projects = await Project.find({ members: userId })
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role')
    .sort({ createdAt: -1 });
  return projects;
};

/**
 * Get single project by ID (validates membership)
 */
const getProjectById = async (projectId, userId) => {
  const project = await Project.findById(projectId)
    .populate('createdBy', 'name email role')
    .populate('members', 'name email role');

  if (!project) {
    throw createError(MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const isMember = project.members.some((m) => m._id.toString() === userId.toString());
  if (!isMember) {
    throw createError(MESSAGES.PROJECT.NOT_MEMBER, HTTP_STATUS.FORBIDDEN);
  }

  return project;
};

/**
 * Add a member to a project (admin only)
 */
const addMember = async (projectId, memberEmail, requestingUserId) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw createError(MESSAGES.PROJECT.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const user = await User.findOne({ email: memberEmail });
  if (!user) {
    throw createError(MESSAGES.AUTH.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
  }

  const alreadyMember = project.members.some(
    (m) => m.toString() === user._id.toString()
  );
  if (alreadyMember) {
    throw createError(MESSAGES.PROJECT.MEMBER_EXISTS, HTTP_STATUS.CONFLICT);
  }

  project.members.push(user._id);
  await project.save();

  await project.populate('members', 'name email role');
  await project.populate('createdBy', 'name email role');

  return project;
};

module.exports = { createProject, getUserProjects, getProjectById, addMember };
