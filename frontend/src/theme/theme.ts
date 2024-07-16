// src/theme/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // 设置你喜欢的颜色
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // 设置你喜欢的颜色
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#424242',
    },
  },
};
