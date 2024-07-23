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
import AccountPage from './Components/AccountPage';

const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.global.theme);
  const muiTheme = createTheme(theme === 'light' ? lightTheme : darkTheme);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <GlobalStyle />
      <Router>
        <Box
          sx={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: muiTheme.palette.background.default, // 设置背景颜色为主题的背景默认颜色
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Header />
          <Container maxWidth="xl" sx={{ flex: '1 0 auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Routes>
                  <Route path="/" element={<HomePage />} /> {/* 默认页面 */}
                  <Route path="/account" element={<AccountPage />} />{' '}
                  {/* 默认页面 */}
                  {/* Add other routes here */}
                </Routes>
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
