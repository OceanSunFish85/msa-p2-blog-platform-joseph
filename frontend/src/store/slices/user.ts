import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { UserBasicInfo } from '../../Models/User';
import UserService from '../../Services/UserService';

export interface UserState {
  user: UserBasicInfo | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

export const fetchUserProfile: any = createAsyncThunk<UserBasicInfo>(
  'user/fetchUserProfile',
  async (_, thunkAPI) => {
    try {
      const user = await UserService.getUserBasicInfo();
      // Save specific fields to localStorage
      localStorage.setItem('userId', user.Id ?? '');
      localStorage.setItem('userName', user.UserName ?? '');
      localStorage.setItem('userEmail', user.Email ?? '');
      localStorage.setItem('userAvatar', user.Avatar ?? '');
      localStorage.setItem('userStatus', user.UserStatus);
      localStorage.setItem('userRole', user.Role ?? '');
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.user = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userAvatar');
      localStorage.removeItem('userStatus');
      localStorage.removeItem('userRole');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<UserBasicInfo>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserProfile } = userSlice.actions;

export default userSlice;
