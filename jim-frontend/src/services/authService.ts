import { API_ENDPOINTS } from '../config/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

// Helper function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login to:', API_ENDPOINTS.auth.login);
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please check if the server is running.');
      }
      throw error;
    }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Attempting registration to:', API_ENDPOINTS.auth.register);
      const response = await fetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      return data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the server. Please check if the server is running.');
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.auth.logout, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
      }

      // Clear the token from localStorage
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async verifyToken(): Promise<AuthResponse> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.auth.verify, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Token verification failed');
      }

      return data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },
}; 