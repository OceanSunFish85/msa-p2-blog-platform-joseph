import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Skeleton, Box } from '@mui/material';

const GlobalSkeleton: React.FC = () => {
  const isLoading = useSelector((state: RootState) => state.global.isLoading);

  return (
    <>
      {isLoading && (
        <Box sx={{ width: '100%', marginTop: 2 }}>
          <Skeleton variant="text" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={118} />
        </Box>
      )}
    </>
  );
};

export default GlobalSkeleton;
