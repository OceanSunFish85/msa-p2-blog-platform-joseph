// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import globalSlice from './slices/global';

export const store = configureStore({
  reducer: {
    global: globalSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
