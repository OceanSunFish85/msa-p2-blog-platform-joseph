import { configureStore } from '@reduxjs/toolkit';
import globalSlice from './slices/global';
import authSlice from './slices/auth';
import userSlice from './slices/user';
import uploadSlice from './slices/upload';

export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
    auth: authSlice.reducer,
    user: userSlice.reducer,
    upload: uploadSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
