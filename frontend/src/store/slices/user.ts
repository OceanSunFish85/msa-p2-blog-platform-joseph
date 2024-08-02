import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { EditProfileRequest, UserBasicInfo } from '../../Models/User';
import {
  getUserBasicInfo,
  updateUserProfile,
} from '../../Services/UserService';

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
      const user = await getUserBasicInfo();
      console.log('User:', user);
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUserInfoThunk: any = createAsyncThunk<
  UserBasicInfo,
  EditProfileRequest
>('user/updateUserInfo', async (editProfileRequest, thunkAPI) => {
  try {
    const updatedUser = await updateUserProfile(editProfileRequest);
    console.log('Updated user:', updatedUser);
    return updatedUser;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.user = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('userAvatar');
      localStorage.removeItem('userStatus');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userBio');
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
          // Save specific fields to localStorage
          localStorage.setItem('userId', action.payload.id ?? '');
          localStorage.setItem('userAvatar', action.payload.avatar ?? '');
          localStorage.setItem('userStatus', action.payload.userStatus);
          localStorage.setItem('userRole', action.payload.role ?? '');
          localStorage.setItem('userBio', action.payload.bio ?? '');
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserInfoThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        updateUserInfoThunk.fulfilled,
        (state, action: PayloadAction<UserBasicInfo>) => {
          state.isLoading = false;
          state.user = action.payload;
          // update info to localStorage
          localStorage.setItem('userId', action.payload.id ?? '');
          localStorage.setItem('userAvatar', action.payload.avatar ?? '');
          localStorage.setItem('userStatus', action.payload.userStatus);
          localStorage.setItem('userRole', action.payload.role ?? '');
          localStorage.setItem('userBio', action.payload.bio ?? '');
        }
      )
      .addCase(updateUserInfoThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserProfile } = userSlice.actions;

export default userSlice;
