import { configureStore, combineReducers } from '@reduxjs/toolkit';
import globalSlice from './slices/global';
import authSlice from './slices/auth';
import userSlice from './slices/user';
import uploadSlice from './slices/upload';
import aiSlice from './slices/ai';
import articleSlice from './slices/article';
import favoriteSlice from './slices/favorite';
import commentSlice from './slices/comment';

// Mock store use to storebook testing
const rootReducer = combineReducers({
  global: globalSlice.reducer,
  auth: authSlice.reducer,
  user: userSlice.reducer,
  upload: uploadSlice.reducer,
  ai: aiSlice.reducer,
  article: articleSlice.reducer,
  favorite: favoriteSlice.reducer,
  comment: commentSlice.reducer,
});

export const createMockStore = (initialState: any) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
  });
};
