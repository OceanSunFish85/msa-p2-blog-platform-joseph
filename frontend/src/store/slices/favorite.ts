import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addFavorite,
  checkFavorite,
  removeFavorite,
} from '../../Services/FavoriteService';

export interface FavoriteState {
  favorites: number[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoriteState = {
  favorites: [],
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
  'favorite/checkFavorite',
  async ({
    articleId,
    userEmail,
  }: {
    articleId: number;
    userEmail: string;
  }) => {
    const favorite = await checkFavorite(articleId, userEmail);
    console.log('Favorite:', favorite);
    return favorite ? articleId : null;
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
        state.favorites = state.favorites.filter((id) => id !== action.payload);
      })
      .addCase(removeFavoriteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove favorite';
      })
      .addCase(checkFavoriteThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkFavoriteThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.favorites.push(action.payload);
        }
      })
      .addCase(checkFavoriteThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to check favorite';
      });
  },
});

export default favoriteSlice;
