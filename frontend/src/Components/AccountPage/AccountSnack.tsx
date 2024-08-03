import React from 'react';
import { Alert, Snackbar, useTheme } from '@mui/material';

interface SnackbarComponentProps {
  snackbarOpen: boolean;
  snackbarMessage: string;
  handleSnackbarClose: () => void;
}

const AccountSnack: React.FC<SnackbarComponentProps> = ({
  snackbarOpen,
  snackbarMessage,
  handleSnackbarClose,
}) => {
  const theme = useTheme();
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={handleSnackbarClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        mt: 8,
        bgcolor: theme.palette.secondary.main,
        opacity: 0.9,
        borderRadius: 1,
      }}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity="success"
        sx={{
          width: '100%',
          opacity: 0.9,
          backgroundColor: theme.palette.secondary.main,
          borderRadius: 1,
          color: theme.palette.background.default,
          '& .MuiAlert-icon': {
            color: theme.palette.background.default,
          },
        }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default AccountSnack;
