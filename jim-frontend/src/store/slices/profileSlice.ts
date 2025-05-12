import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsService } from '@/services/settingsService';

// Types
export interface ProfileStats {
  workouts: number;
  followers: number;
  following: number;
}

export interface ProfileData {
  id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  stats: ProfileStats;
  measurements?: {
    height?: number;
    weight?: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    arms?: number;
    date?: string;
  };
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
}

interface ProfileState {
  data: ProfileData | null;
  loading: boolean;
  error: string | null;
  updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Initial state
const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
  updateStatus: 'idle',
};

// Async thunks
export const updateProfileAsync = createAsyncThunk(
  'profile/updateProfile',
  async (data: Partial<ProfileData>, { rejectWithValue }) => {
    try {
      const response = await settingsService.updateProfile(data);
      return response.data;
    } catch (error) {
      return rejectWithValue('Failed to update profile');
    }
  }
);

export const updatePasswordAsync = createAsyncThunk(
  'profile/updatePassword',
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await settingsService.updatePassword(currentPassword, newPassword);
      return true;
    } catch (error) {
      return rejectWithValue('Failed to update password');
    }
  }
);

export const updateEmailAsync = createAsyncThunk(
  'profile/updateEmail',
  async ({ newEmail, password }: { newEmail: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await settingsService.updateEmail(newEmail, password);
      return response.email;
    } catch (error) {
      return rejectWithValue('Failed to update email');
    }
  }
);

export const updateUsernameAsync = createAsyncThunk(
  'profile/updateUsername',
  async ({ newUsername, password }: { newUsername: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await settingsService.updateUsername(newUsername, password);
      return response.username;
    } catch (error) {
      return rejectWithValue('Failed to update username');
    }
  }
);

export const updateMeasurementsAsync = createAsyncThunk(
  'profile/updateMeasurements',
  async (measurements: ProfileData['measurements'], { rejectWithValue }) => {
    try {
      const response = await settingsService.updateMeasurements(measurements);
      return response.measurements;
    } catch (error) {
      return rejectWithValue('Failed to update measurements');
    }
  }
);

export const updatePreferencesAsync = createAsyncThunk(
  'profile/updatePreferences',
  async (preferences: ProfileData['preferences'], { rejectWithValue }) => {
    try {
      const response = await settingsService.updatePreferences(preferences);
      return response.preferences;
    } catch (error) {
      return rejectWithValue('Failed to update preferences');
    }
  }
);

// Create slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Set profile data
    setProfileData: (state, action: PayloadAction<ProfileData>) => {
      state.data = action.payload;
      state.error = null;
    },

    // Update profile data
    updateProfileData: (state, action: PayloadAction<Partial<ProfileData>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },

    // Update stats
    updateStats: (state, action: PayloadAction<Partial<ProfileStats>>) => {
      if (state.data) {
        state.data.stats = { ...state.data.stats, ...action.payload };
      }
    },

    // Update measurements
    updateMeasurements: (state, action: PayloadAction<ProfileData['measurements']>) => {
      if (state.data) {
        state.data.measurements = { ...state.data.measurements, ...action.payload };
      }
    },

    // Update preferences
    updatePreferences: (state, action: PayloadAction<ProfileData['preferences']>) => {
      if (state.data) {
        state.data.preferences = { ...state.data.preferences, ...action.payload };
      }
    },

    // Clear profile data
    clearProfileData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        if (state.data) {
          state.data = { ...state.data, ...action.payload };
        }
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update Email
      .addCase(updateEmailAsync.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateEmailAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        if (state.data) {
          state.data.email = action.payload;
        }
      })
      .addCase(updateEmailAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update Username
      .addCase(updateUsernameAsync.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateUsernameAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        if (state.data) {
          state.data.username = action.payload;
        }
      })
      .addCase(updateUsernameAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update Measurements
      .addCase(updateMeasurementsAsync.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateMeasurementsAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        if (state.data) {
          state.data.measurements = action.payload;
        }
      })
      .addCase(updateMeasurementsAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      })
      // Update Preferences
      .addCase(updatePreferencesAsync.pending, (state) => {
        state.updateStatus = 'loading';
        state.error = null;
      })
      .addCase(updatePreferencesAsync.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        if (state.data) {
          state.data.preferences = action.payload;
        }
      })
      .addCase(updatePreferencesAsync.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setLoading,
  setError,
  setProfileData,
  updateProfileData,
  updateStats,
  updateMeasurements,
  updatePreferences,
  clearProfileData,
} = profileSlice.actions;

// Export reducer
export default profileSlice.reducer; 