import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface SnackbarComponentProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

const EditSnackbar: React.FC<SnackbarComponentProps> = ({
  open,
  message,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        mt: 8,
        bgcolor: 'secondary.main',
        opacity: 0.9,
        borderRadius: 1,
      }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        sx={{
          width: '100%',
          opacity: 0.9,
          backgroundColor: 'secondary.main',
          borderRadius: 1,
          color: 'background.default',
          '& .MuiAlert-icon': {
            color: 'background.default', // 自定义图标颜色
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default EditSnackbar;
