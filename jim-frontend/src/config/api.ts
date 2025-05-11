export const API_BASE_URL = 'http://localhost:5000/api';

// Log the API endpoints for debugging
console.log('API Endpoints:', {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  logout: `${API_BASE_URL}/auth/logout`,
  verify: `${API_BASE_URL}/auth/verify`,
});

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    verify: `${API_BASE_URL}/auth/verify`,
  },
}; 