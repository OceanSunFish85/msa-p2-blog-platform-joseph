// src/store/slices/global.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalState {
  theme: 'light' | 'dark';
}

const initialState: GlobalState = {
  theme: 'light',
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
  },
});

export const { toggleTheme, setTheme } = globalSlice.actions;
export default globalSlice;
