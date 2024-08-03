import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  addFavorite,
  checkFavorite,
  removeFavorite,
} from '../../Services/FavoriteService';

// Define a type for the slice state
export interface FavoriteState {
  favorites: number[];
  isFavorite: boolean;
  loading: boolean;
  error: string | null;
}
// Define the initial state using that type
const initialState: FavoriteState = {
  favorites: [],
  isFavorite: false,
  loading: false,
  error: null,
};
// Define a thunk that dispatches those actions
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
// Define a thunk that dispatches those actions
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
// Define a thunk that dispatches those actions
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
// Define the slice using the initial state
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
        state.isFavorite = action.payload;
        console.log('state.isFavorite action:', state.isFavorite);
      })
      .addCase(checkFavoriteThunk.rejected, (state) => {
        state.loading = false;
        state.isFavorite = false;
      });
  },
});

export default favoriteSlice;
