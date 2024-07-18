// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Grid,
  createTheme,
  Container,
} from '@mui/material';
import { useSelector } from 'react-redux';

import Header from './Layout/Header';

import HomePage from './Components/HomePage';
import { lightTheme, darkTheme } from './theme/theme';
import GlobalStyle from './theme/globalStyles';
import { RootState } from './store/store';
import Footer from './Layout/Footer';

const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.global.theme);
  const muiTheme = createTheme(theme === 'light' ? lightTheme : darkTheme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <GlobalStyle />
      <Router>
        <Box sx={{ width: '100%' }}>
          <Header />
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid item xs={12} border={1}>
                <HomePage />
              </Grid>
            </Grid>
          </Container>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
