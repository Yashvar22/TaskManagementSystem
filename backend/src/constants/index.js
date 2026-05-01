const ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member',
};

const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
};

const MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already registered',
    USER_NOT_FOUND: 'User not found',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_MISSING: 'Access token required',
    TOKEN_INVALID: 'Invalid or expired token',
    FORBIDDEN: 'You do not have permission to perform this action',
  },
  PROJECT: {
    NOT_FOUND: 'Project not found',
    NOT_MEMBER: 'You are not a member of this project',
    MEMBER_EXISTS: 'User is already a member',
    CREATED: 'Project created successfully',
    MEMBER_ADDED: 'Member added successfully',
  },
  TASK: {
    NOT_FOUND: 'Task not found',
    NOT_ASSIGNED: 'You are not assigned to this task',
    CREATED: 'Task created successfully',
    UPDATED: 'Task updated successfully',
    DELETED: 'Task deleted successfully',
  },
  VALIDATION: {
    REQUIRED: 'This field is required',
    INVALID_EMAIL: 'Please provide a valid email',
    SHORT_PASSWORD: 'Password must be at least 6 characters',
  },
};

module.exports = { ROLES, TASK_STATUS, HTTP_STATUS, MESSAGES };
