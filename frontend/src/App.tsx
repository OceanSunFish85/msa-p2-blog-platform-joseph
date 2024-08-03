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
import HomePage from './Components/HomePage/Home';
import { lightTheme, darkTheme } from './theme/theme';
import GlobalStyle from './theme/globalStyles';
import { RootState } from './store/store';
import Footer from './Layout/Footer';
import LoginPage from './Components/LoginPage';
import NewPost from './Components/NewPost/NewPostPage';
import EditArticle from './Components/EditArticle/EditArticle';
import DetailPage from './Components/ArticleDetail/ArticleDetail';
import AccountPage from './Components/AccountPage/AccountPage';

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
            backgroundColor: muiTheme.palette.background.default,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Header />
          <Container maxWidth="xl" sx={{ flex: '1 0 auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/account" element={<AccountPage />} />{' '}
                  <Route path="/detail" element={<DetailPage />} />{' '}
                  <Route path="/newPost" element={<NewPost />} />{' '}
                  <Route path="/editPost" element={<EditArticle />} />
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
