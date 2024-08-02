import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addFavorite,
  checkFavorite,
  removeFavorite,
} from '../../Services/FavoriteService';

export interface FavoriteState {
  favorites: number[];
  isFavorite: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favorites: [],
  isFavorite: false,
  loading: false,
  error: null,
};

export const addFavoriteThunk: any = createAsyncThunk(
  'favorite/addFavorite',
  async ({
    articleId,
    userEmail,
  }: {
    articleId: number;
    userEmail: string;
  }) => {
    await addFavorite(articleId, userEmail);
    return articleId;
  }
);

export const removeFavoriteThunk: any = createAsyncThunk(
  'favorite/removeFavorite',
  async ({
    articleId,
    userEmail,
  }: {
    articleId: number;
    userEmail: string;
  }) => {
    await removeFavorite(articleId, userEmail);
    return articleId;
  }
);

export const checkFavoriteThunk: any = createAsyncThunk(
  'favorite/chectFavorite',
  async ({
    articleId,
    userEmail,
  }: {
    articleId: number;
    userEmail: string;
  }) => {
    const isFavorite = await checkFavorite(articleId, userEmail);
    console.log('Favorite Thunk:', isFavorite);
    return isFavorite;
  }
);

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFavoriteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavoriteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isFavorite = true;
        state.favorites.push(action.payload);
      })
      .addCase(addFavoriteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add favorite';
      })
      .addCase(removeFavoriteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavoriteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isFavorite = false;
        state.favorites = state.favorites.filter((id) => id !== action.payload);
      })
      .addCase(removeFavoriteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove favorite';
      })
      .addCase(checkFavoriteThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkFavoriteThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isFavorite = action.payload; // 确保设置为布尔值
        console.log('state.isFavorite action:', state.isFavorite);
      })
      .addCase(checkFavoriteThunk.rejected, (state) => {
        state.loading = false;
        state.isFavorite = false;
      });
  },
});

export default favoriteSlice;
