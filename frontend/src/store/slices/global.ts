// src/store/slices/global.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  theme: 'light' | 'dark';
  isLoading: boolean;
}

const initialState: GlobalState = {
  theme: 'light',
  isLoading: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setLoading } = globalSlice.actions;
export default globalSlice;
