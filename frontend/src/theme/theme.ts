import { createTheme, ThemeOptions } from '@mui/material/styles';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#ffffff', // 白色
    },
    secondary: {
      main: '#6B46C1', // 淡紫色
    },
    background: {
      default: '#ffffff', // 白色
      paper: '#e0e0e0', // 灰色
    },
    text: {
      primary: '#000000', // 黑色
      secondary: '#ffffff', // 灰色
    },
    action: {
      selected: '#6B46C1', // 自定义选中颜色
      hover: '#6B46C1', // 自定义悬停颜色
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#303030', // 深灰色
    },
    secondary: {
      main: '#6B46C1', // 深紫色
    },
    background: {
      default: '#121212', // 深灰色
      paper: '#1e1e1e', // 更深的灰色
    },
    text: {
      primary: '#ffffff', // 白色
      secondary: '#bbbbbb', // 浅灰色
    },
  },
};
