import axios from 'axios';

// Use relative URL so requests go through Vite proxy → no CORS issues
// Vite proxy config: /api → http://localhost:5000 (see vite.config.js)
const BASE_URL = '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ttm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error - backend not reachable
    if (!error.response) {
      error.userMessage = 'Cannot connect to server. Make sure backend is running on port 5000.';
      return Promise.reject(error);
    }
    // Auto logout on 401
    if (error.response.status === 401) {
      localStorage.removeItem('ttm_token');
      localStorage.removeItem('ttm_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  create: (data) => api.post('/projects', data),
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  addMember: (id, email) => api.post(`/projects/${id}/add-member`, { email }),
};

// Tasks API
export const tasksAPI = {
  create: (data) => api.post('/tasks', data),
  getByProject: (projectId, filters = {}) =>
    api.get('/tasks', { params: { projectId, ...filters } }),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
};

export default api;
