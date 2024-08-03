import { ThemeOptions } from '@mui/material/styles';

export const lightTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#6B46C1',
      light: '#9F7AEA',
    },
    background: {
      default: '#ffffff',
      paper: '#e0e0e0',
    },
    text: {
      primary: '#000000',
      secondary: '#e0e0e0',
    },
    action: {
      selected: '#6B46C1',
      hover: '#6B46C1',
    },
  },
};

export const darkTheme: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#303030',
    },
    secondary: {
      main: '#6B46C1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
};
