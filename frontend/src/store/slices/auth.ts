import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
} from '../../Models/Auth';
import AuthService from '../../Services/AuthService';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../useAppDispatch';
import { setLoading } from './global';

export interface AuthState {
  username: string | null;
  email: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  username: null,
  email: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// 尝试从 localStorage 恢复身份验证状态
if (localStorage.getItem('isAuthenticated') === 'true') {
  initialState.isAuthenticated = true;
}

export const login: any = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const response = await AuthService.login(credentials);
      console.log('Login response:', response);
      console.log('Response Token:', response.token);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const changePasswordThunk: any = createAsyncThunk(
  'auth/changePassword',
  async (data: ChangePasswordRequest, thunkAPI) => {
    try {
      const response = await AuthService.changePassword(data);
      thunkAPI.dispatch(logout()); // 修改密码成功后触发登出
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.username = null;
      state.email = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.isLoading = false;
          state.username = action.payload.username;
          state.email = action.payload.email;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('username', action.payload.username); // 保存用户名
          localStorage.setItem('email', action.payload.email); // 保存邮箱
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(changePasswordThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(
        changePasswordThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { logout } = authSlice.actions;

export default authSlice;
