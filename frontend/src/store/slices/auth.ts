import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
} from '../../Models/Auth';
import AuthService from '../../Services/AuthService';

// Define a type for the slice state
export interface AuthState {
  username: string | null;
  email: string | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
// Define the initial state using that type
const initialState: AuthState = {
  username: null,
  email: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// try to get the initial state from local storage
if (localStorage.getItem('isAuthenticated') === 'true') {
  initialState.isAuthenticated = true;
}
// Define a thunk that dispatches those actions
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
// Define a thunk that dispatches those actions
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
    // Log out
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
          localStorage.setItem('isAuthenticated', 'true'); // set the isAuthenticated flag to true
          localStorage.setItem('token', action.payload.token); // save the token to local storage
          localStorage.setItem('username', action.payload.username); // save the username to local storage
          localStorage.setItem('email', action.payload.email); // save the email to local storage
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
