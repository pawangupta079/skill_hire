import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
  logout: () => api.post('/api/auth/logout'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
  changePassword: (data) => api.post('/api/auth/change-password', data),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  uploadProfilePicture: (formData) => api.post('/api/users/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadResume: (formData) => api.post('/api/users/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getUser: (id) => api.get(`/api/users/${id}`),
  getUsers: (params) => api.get('/api/users', { params }),
  updateUserStatus: (id, data) => api.put(`/api/users/${id}/status`, data),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params) => api.get('/api/jobs', { params }),
  getJob: (id) => api.get(`/api/jobs/${id}`),
  createJob: (data) => api.post('/api/jobs', data),
  updateJob: (id, data) => api.put(`/api/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/api/jobs/${id}`),
  getMyJobs: (params) => api.get('/api/jobs/my-jobs', { params }),
  updateJobStatus: (id, data) => api.put(`/api/jobs/${id}/status`, data),
  getSearchSuggestions: (q) => api.get('/api/jobs/search/suggestions', { params: { q } }),
};

// Applications API
export const applicationsAPI = {
  applyForJob: (data) => api.post('/api/applications', data),
  getMyApplications: (params) => api.get('/api/applications/my-applications', { params }),
  getJobApplications: (jobId, params) => api.get(`/api/applications/job/${jobId}`, { params }),
  getApplication: (id) => api.get(`/api/applications/${id}`),
  updateApplicationStatus: (id, data) => api.put(`/api/applications/${id}/status`, data),
  addNote: (id, data) => api.post(`/api/applications/${id}/notes`, data),
  scheduleInterview: (id, data) => api.post(`/api/applications/${id}/interview`, data),
  getDashboardStats: () => api.get('/api/applications/dashboard/stats'),
};

// Chat API
export const chatAPI = {
  createRoom: (data) => api.post('/api/chat/room', data),
  getRooms: () => api.get('/api/chat/rooms'),
  getRoomMessages: (roomId, params) => api.get(`/api/chat/room/${roomId}/messages`, { params }),
  markMessageAsRead: (roomId, messageId) => api.post(`/api/chat/room/${roomId}/messages/${messageId}/read`),
  editMessage: (messageId, data) => api.put(`/api/chat/messages/${messageId}`, data),
  deleteMessage: (messageId) => api.delete(`/api/chat/messages/${messageId}`),
  getUnreadCount: (roomId) => api.get('/api/chat/unread-count', { params: { roomId } }),
};

export default api;
