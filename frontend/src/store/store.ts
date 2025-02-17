import { configureStore } from '@reduxjs/toolkit';
import globalSlice from './slices/global';
import authSlice from './slices/auth';
import userSlice from './slices/user';
import uploadSlice from './slices/upload';
import aiSlice from './slices/ai';
import articleSlice from './slices/article';
import favoriteSlice from './slices/favorite';
import commentSlice from './slices/comment';
// Create a store with the slices
export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
    auth: authSlice.reducer,
    user: userSlice.reducer,
    upload: uploadSlice.reducer,
    ai: aiSlice.reducer,
    article: articleSlice.reducer,
    favorite: favoriteSlice.reducer,

    comment: commentSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
