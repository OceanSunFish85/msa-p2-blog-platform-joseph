// src/components/Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { toggleTheme } from '../store/slices/global';
import { useAppDispatch } from '../store/useAppDispatch';
import { useAppSelector } from '../store/useAppSelecter';

const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.global.theme);

  return (
    <div>
      <Header />
      <Container>
        <Box my={2}>
          <Button onClick={() => dispatch(toggleTheme())}>
            {theme === 'light'
              ? 'Switch to Dark Theme'
              : 'Switch to Light Theme'}
          </Button>
          <Outlet />
        </Box>
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;
