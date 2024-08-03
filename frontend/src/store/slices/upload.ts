import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  uploadArticleMedia,
  uploadAvatar,
  uploadCover,
} from '../../Services/UploadService';
// Define a type for the slice state
export interface UploadState {
  isLoading: boolean;
  error: string | null;
  avatar: string | null;
  cover: string | null;
  articleMedia: string[];
}
// Define the initial state using that type
const initialState: UploadState = {
  isLoading: false,
  error: null,
  avatar: null,
  cover: null,
  articleMedia: [],
};

// Thunks for uploading avatar files
export const uploadAvatarThunk: any = createAsyncThunk(
  'upload/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const url = await uploadAvatar(file);
      return url;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
// Thunks for uploading cover files
export const uploadCoverThunk: any = createAsyncThunk(
  'upload/uploadCover',
  async (file: File, { rejectWithValue }) => {
    try {
      const url = await uploadCover(file);
      return url;
    } catch (error: any) {
      console.error('Thunk upload error:', error);
      return rejectWithValue(error.message);
    }
  }
);
// Thunks for article media uploading files
export const uploadArticleMediaThunk: any = createAsyncThunk(
  'upload/uploadArticleMedia',
  async (files: File[], { rejectWithValue }) => {
    try {
      const urls = await uploadArticleMedia(files);
      return urls;
    } catch (error: any) {
      console.error('Thunk upload error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    // Reset the upload state
    resetUploadState: (state) => {
      state.isLoading = false;
      state.error = null;
      (state.avatar = null), (state.cover = null);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadAvatarThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        uploadAvatarThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.avatar = action.payload;
          localStorage.setItem('userAvatar', action.payload);
        }
      )
      .addCase(
        uploadAvatarThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addCase(uploadCoverThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        uploadCoverThunk.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isLoading = false;
          state.cover = action.payload;
        }
      )
      .addCase(
        uploadCoverThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )
      .addCase(uploadArticleMediaThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        uploadArticleMediaThunk.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.isLoading = false;
          state.articleMedia = action.payload;
        }
      )
      .addCase(
        uploadArticleMediaThunk.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { resetUploadState } = uploadSlice.actions;
export default uploadSlice;
