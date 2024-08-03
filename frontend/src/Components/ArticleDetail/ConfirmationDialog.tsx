import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from '@mui/material';

const ConfirmationDialog: React.FC<{
  open: boolean;
  onClose: (confirm: boolean) => void;
}> = ({ open, onClose }) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      sx={{
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        opacity: 0.9,
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{ bgcolor: theme.palette.background.default }}
      >
        {'Cancel Favorite !'}
      </DialogTitle>
      <DialogContent sx={{ bgcolor: theme.palette.background.default }}>
        <DialogContentText
          id="alert-dialog-description"
          color={theme.palette.text.primary}
        >
          Are you sure you want to unfavourite this post?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ bgcolor: theme.palette.background.default }}>
        <Button
          onClick={() => onClose(false)}
          sx={{ color: theme.palette.text.primary }}
        >
          No
        </Button>
        <Button
          onClick={() => onClose(true)}
          sx={{ color: theme.palette.secondary.main }}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
