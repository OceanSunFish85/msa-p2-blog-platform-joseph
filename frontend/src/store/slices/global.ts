// src/store/slices/global.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
export interface GlobalState {
  theme: 'light' | 'dark';
  isLoading: boolean;
}
// Define the initial state using that type
const initialState: GlobalState = {
  theme: 'light',
  isLoading: false,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    // control the theme of the app
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    // set the theme of the app
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
