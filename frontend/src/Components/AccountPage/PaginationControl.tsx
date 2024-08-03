import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';

interface PaginationControlsProps {
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  userArticlesLength: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  handlePrevPage,
  handleNextPage,
  userArticlesLength,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Grid container alignItems="center">
        <Grid item xs={4} display="flex" justifyContent="flex-start">
          {currentPage > 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevPage}
            >
              Prev
            </Button>
          )}
        </Grid>
        <Grid item xs={4} display="flex" justifyContent="center">
          <Typography variant="body1">Page {currentPage}</Typography>
        </Grid>
        <Grid item xs={4} display="flex" justifyContent="flex-end">
          {userArticlesLength === 10 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPage}
            >
              Next
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PaginationControls;
