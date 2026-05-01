const Task = require('../models/Task');
const Project = require('../models/Project');
const { TASK_STATUS } = require('../constants');

/**
 * Get aggregated dashboard data for a user
 */
const getDashboardData = async (userId, userRole) => {
  const now = new Date();

  // Get projects the user is a member of
  const userProjects = await Project.find({ members: userId }).select('_id name');
  const projectIds = userProjects.map((p) => p._id);

  // Base query for tasks in user's projects
  const baseQuery = { projectId: { $in: projectIds } };

  // Aggregate task statistics
  const [totalTasks, completedTasks, pendingTasks, overdueTasks, recentTasks, tasksByStatus] =
    await Promise.all([
      Task.countDocuments(baseQuery),
      Task.countDocuments({ ...baseQuery, status: TASK_STATUS.DONE }),
      Task.countDocuments({ ...baseQuery, status: { $ne: TASK_STATUS.DONE } }),
      Task.countDocuments({
        ...baseQuery,
        dueDate: { $lt: now },
        status: { $ne: TASK_STATUS.DONE },
      }),
      Task.find(baseQuery)
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('assignedTo', 'name email')
        .populate('projectId', 'name'),
      Task.aggregate([
        { $match: baseQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

  // Format status breakdown
  const statusBreakdown = {
    todo: 0,
    'in-progress': 0,
    done: 0,
  };
  tasksByStatus.forEach(({ _id, count }) => {
    statusBreakdown[_id] = count;
  });

  return {
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      totalProjects: userProjects.length,
    },
    statusBreakdown,
    recentTasks,
    projects: userProjects,
  };
};

module.exports = { getDashboardData };
