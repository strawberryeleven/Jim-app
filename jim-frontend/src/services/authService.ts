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

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  profileImage?: string;
  bio?: string;
  workoutCount: number;
  followersCount: number;
  followingCount: number;
  followers: string[];
  following: string[];
  createdAt?: string;
  lastLogin?: string;
}

interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}

interface UpdateProfileData {
  username: string;
  bio?: string;
  link?: string;
  sex?: 'male' | 'female' | 'other';
  DOB?: string;
}

interface UpdateProfileResponse {
  success: boolean;
  profile: {
    userId: string;
    username: string;
    bio: string;
    link: string;
    sex: string;
    DOB: Date;
    createdAt: Date;
    updatedAt: Date;
  };
}

interface UpdateUsernameData {
  name: string;
}

interface UpdateEmailData {
  email: string;
}

interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface UpdateResponse {
  success: boolean;
  user: User;
}

// Helper function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API errors
const handleApiError = async (response: Response) => {
  const data = await response.json() as ErrorResponse;
  throw new Error(data.error || 'An error occurred');
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

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json() as AuthResponse;
      
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

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json() as AuthResponse;
      
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
        await handleApiError(response);
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

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json() as AuthResponse;
      return data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },

  async getProfile(): Promise<User> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.users.profile, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  async updateProfile(profileData: UpdateProfileData): Promise<UpdateProfileResponse> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.users.updateProfile, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  async updateUsername(data: UpdateUsernameData): Promise<UpdateResponse> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.users.updateUsername, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Update username error:', error);
      throw error;
    }
  },

  async updateEmail(data: UpdateEmailData): Promise<UpdateResponse> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.users.updateEmail, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Update email error:', error);
      throw error;
    }
  },

  async updatePassword(data: UpdatePasswordData): Promise<UpdateResponse> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.users.updatePassword, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  },
}; 