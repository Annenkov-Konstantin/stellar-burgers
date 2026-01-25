import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '../../utils/types';
import { TRegisterData, TLoginData } from '../../utils/burger-api';
import {
  registerUserApi,
  loginUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData) => {
    const response = await registerUserApi(userData);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: { email: string }) => {
    const response = await forgotPasswordApi(email);
    return response;
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (passwordData: { password: string; token: string }) => {
    const response = await resetPasswordApi(passwordData);
    return response;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  const response = await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return response;
});

export type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  forgotPasswordRequest: boolean;
  forgotPasswordSuccess: boolean;
  resetPasswordRequest: boolean;
  resetPasswordSuccess: boolean;
};

export const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  forgotPasswordRequest: false,
  forgotPasswordSuccess: false,
  resetPasswordRequest: false,
  resetPasswordSuccess: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPasswordStatus: (state) => {
      state.resetPasswordSuccess = false;
      state.resetPasswordRequest = false;
    },
    forgotPasswordStatus: (state) => {
      state.forgotPasswordSuccess = false;
      state.forgotPasswordRequest = false;
    }
  },
  selectors: {
    getUserData: (state) => state.user,
    isAuthChecked: (state) => state.isAuthChecked,
    getUserLoading: (state) => state.isLoading,
    getUserError: (state) => state.error,
    getForgotPasswordStatus: (state) => ({
      request: state.forgotPasswordRequest,
      success: state.forgotPasswordSuccess
    }),
    getResetPasswordStatus: (state) => ({
      request: state.resetPasswordRequest,
      success: state.resetPasswordSuccess
    })
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPasswordRequest = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotPasswordRequest = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordRequest = false;
        state.error = action.error.message || 'Forgot password request failed';
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordRequest = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPasswordRequest = false;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordRequest = false;
        state.error = action.error.message || 'Password reset failed';
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get user data';
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update user data';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Logout failed';
        state.user = null;
      });
  }
});

export default userSlice.reducer;
export const {
  authChecked,
  clearError,
  resetPasswordStatus,
  forgotPasswordStatus
} = userSlice.actions;
export const {
  getUserData,
  isAuthChecked,
  getUserLoading,
  getUserError,
  getForgotPasswordStatus,
  getResetPasswordStatus
} = userSlice.selectors;
