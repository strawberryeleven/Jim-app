import { ProfileData } from '@/store/slices/profileSlice';

// Dummy API delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dummy API responses
const dummyResponses = {
  success: { success: true, message: 'Operation successful' },
  error: { success: false, message: 'Operation failed' },
};

export const settingsService = {
  // Profile Update
  updateProfile: async (data: Partial<ProfileData>) => {
    await delay(1000); // Simulate network delay
    return { ...dummyResponses.success, data };
  },

  // Password Update
  updatePassword: async (currentPassword: string, newPassword: string) => {
    await delay(1000);
    return dummyResponses.success;
  },

  // Email Update
  updateEmail: async (newEmail: string, password: string) => {
    await delay(1000);
    return { ...dummyResponses.success, email: newEmail };
  },

  // Username Update
  updateUsername: async (newUsername: string, password: string) => {
    await delay(1000);
    return { ...dummyResponses.success, username: newUsername };
  },

  // Measurements Update
  updateMeasurements: async (measurements: ProfileData['measurements']) => {
    await delay(1000);
    return { ...dummyResponses.success, measurements };
  },

  // Preferences Update
  updatePreferences: async (preferences: ProfileData['preferences']) => {
    await delay(1000);
    return { ...dummyResponses.success, preferences };
  },

  // Delete Account
  deleteAccount: async (password: string) => {
    await delay(1000);
    return dummyResponses.success;
  },
}; 