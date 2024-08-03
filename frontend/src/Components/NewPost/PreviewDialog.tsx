import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PreviewDialogProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  content: string;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  handleClose,
  title,
  content,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: theme.palette.background.default,
        },
      }}
    >
      <DialogTitle>Article Preview</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <div
          className="ql-container ql-snow"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewDialog;
