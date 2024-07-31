import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { LoginRequest, LoginResponse } from '../../Models/Auth';
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
          console.log('Action Username:', action.payload.username);
          state.email = action.payload.email;
          console.log('Action Email:', action.payload.email);
          state.token = action.payload.token;
          console.log('Action Token:', action.payload.token);
          state.isAuthenticated = true;
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('token', action.payload.token);
          console.log('Local Token:', localStorage.getItem('token'));
        }
      )
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice;
