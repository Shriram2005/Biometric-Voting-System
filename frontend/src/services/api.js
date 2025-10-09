import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const registerUser = (userData) => api.post('/register', userData);
export const loginUser = (faceImage) => api.post('/login', { face_image: faceImage });
export const getUser = (voterId) => api.get(`/user/${voterId}`);
export const checkVotingStatus = (voterId) => api.get(`/voting-status/${voterId}`);

// Voting APIs
export const getCandidates = () => api.get('/candidates');
export const castVote = (voteData) => api.post('/vote', voteData);

// Admin APIs
export const adminLogin = (credentials) => api.post('/admin/login', credentials);
export const getAdminStats = () => api.get('/admin/stats');
export const getAllUsers = () => api.get('/admin/users');
export const addCandidate = (candidateData) => api.post('/admin/candidate', candidateData);
export const updateCandidate = (candidateId, candidateData) => 
  api.put(`/admin/candidate/${candidateId}`, candidateData);
export const deleteCandidate = (candidateId) => api.delete(`/admin/candidate/${candidateId}`);
export const exportCSV = () => api.get('/admin/export/csv', { responseType: 'blob' });
export const exportPDF = () => api.get('/admin/export/pdf', { responseType: 'blob' });

// Health check
export const healthCheck = () => api.get('/health');

export default api;
