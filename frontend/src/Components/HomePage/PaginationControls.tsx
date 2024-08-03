import { Box, Button, Grid, Typography } from '@mui/material';

const PaginationControls = ({
  currentPage,
  handlePrevPage,
  handleNextPage,
  articlesLength,
}: {
  currentPage: number;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  articlesLength: number;
}) => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    mt={4}
    width="100%"
  >
    <Grid container alignItems="center">
      <Grid item xs={4} display="flex" justifyContent="flex-start">
        {currentPage > 1 && (
          <Button variant="contained" color="primary" onClick={handlePrevPage}>
            Prev
          </Button>
        )}
      </Grid>
      <Grid item xs={4} display="flex" justifyContent="center">
        <Typography variant="body1">Page {currentPage}</Typography>
      </Grid>
      <Grid item xs={4} display="flex" justifyContent="flex-end">
        {articlesLength === 10 && (
          <Button variant="contained" color="primary" onClick={handleNextPage}>
            Next
          </Button>
        )}
      </Grid>
    </Grid>
  </Box>
);

export default PaginationControls;
