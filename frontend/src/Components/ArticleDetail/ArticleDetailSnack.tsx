import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

const ArticleDetailSnack: React.FC<{
  open: boolean;
  message: string;
  onClose: () => void;
  isLoginPrompt?: boolean;
}> = ({ open, message, onClose, isLoginPrompt }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={onClose}
      sx={{
        mt: 8,
        bgcolor: 'secondary.main',
        opacity: 0.9,
        borderRadius: 1,
      }}
    >
      <Alert
        onClose={onClose}
        severity="info"
        sx={{
          width: '100%',
          opacity: 0.9,
          backgroundColor: 'secondary.main',
          borderRadius: 1,
          color: 'background.default',
          '& .MuiAlert-icon': {
            color: 'background.default',
          },
        }}
      >
        {isLoginPrompt ? (
          <Link
            to="/login"
            style={{
              color: 'background.default',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={() => onClose()}
          >
            Please Login
          </Link>
        ) : (
          message
        )}
      </Alert>
    </Snackbar>
  );
};

export default ArticleDetailSnack;
