import axios from 'axios';
import { API_BASE_URL } from '@/config/api';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  users: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const userService = {
  async getAllUsers(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });
    const response = await axios.get<PaginatedResponse<User>>(`${API_BASE_URL}/users?${params}`, getAuthHeaders());
    return response.data;
  },

  async followUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.post<{ success: boolean; message: string }>(
      `${API_BASE_URL}/users/${userId}/follow`,
      {},
      getAuthHeaders()
    );
    return response.data;
  },

  async unfollowUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.delete<{ success: boolean; message: string }>(
      `${API_BASE_URL}/users/${userId}/follow`,
      getAuthHeaders()
    );
    return response.data;
  },
}; 