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
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
    verify: `${API_BASE_URL}/auth/verify`,
  },
  users: {
    profile: `${API_BASE_URL}/users/profile`,
    updateProfile: `${API_BASE_URL}/users/profile`,
    updateUsername: `${API_BASE_URL}/users/name`,
    updateEmail: `${API_BASE_URL}/users/email`,
    updatePassword: `${API_BASE_URL}/users/password`,
  },
  exercises: {
    getAll: `${API_BASE_URL}/exercises`,
    create: `${API_BASE_URL}/exercises`,
    getById: (id: string) => `${API_BASE_URL}/exercises/${id}`,
    update: (id: string) => `${API_BASE_URL}/exercises/${id}`,
    delete: (id: string) => `${API_BASE_URL}/exercises/${id}`,
  },
  workouts: {
    getAll: `${API_BASE_URL}/workouts`,
    create: `${API_BASE_URL}/workouts`,
    getById: (id: string) => `${API_BASE_URL}/workouts/${id}`,
    update: (id: string) => `${API_BASE_URL}/workouts/${id}`,
    delete: (id: string) => `${API_BASE_URL}/workouts/${id}`,
    like: (id: string) => `${API_BASE_URL}/workouts/${id}/like`,
    getUserWorkouts: (userId: string) => `${API_BASE_URL}/workouts/user/${userId}`,
  },
  routines: {
    getAll: `${API_BASE_URL}/routines`,
    create: `${API_BASE_URL}/routines`,
    getById: (id: string) => `${API_BASE_URL}/routines/${id}`,
    update: (id: string) => `${API_BASE_URL}/routines/${id}`,
    delete: (id: string) => `${API_BASE_URL}/routines/${id}`,
    like: (id: string) => `${API_BASE_URL}/routines/${id}/like`,
    getUserRoutines: (userId: string) => `${API_BASE_URL}/routines/user/${userId}`,
  },
  workoutLogs: {
    create: `${API_BASE_URL}/workout-logs`,
    getAll: `${API_BASE_URL}/workout-logs`,
    getById: (id: string) => `${API_BASE_URL}/workout-logs/${id}`,
    update: (id: string) => `${API_BASE_URL}/workout-logs/${id}`,
    delete: (id: string) => `${API_BASE_URL}/workout-logs/${id}`,
    getUserLogs: (userId: string) => `${API_BASE_URL}/workout-logs/user/${userId}`,
    getStats: `${API_BASE_URL}/workout-logs/stats`,
  },
}; 