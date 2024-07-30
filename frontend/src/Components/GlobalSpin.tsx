import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Backdrop, CircularProgress } from '@mui/material';

const GlobalSpin: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.global.isLoading);

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default GlobalSpin;
