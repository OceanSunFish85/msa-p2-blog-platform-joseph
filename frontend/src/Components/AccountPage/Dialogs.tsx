import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';

interface DialogsProps {
  open: boolean;
  onClose: () => void;
  selectedFile: File | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  deleteOpen: boolean;
  deleteClose: () => void;
  deleteId: number | null;
  onDelete: (id: number) => void;
  passwordOpen: boolean;
  passwordClose: () => void;
  currentPassword: string;
  newPassword: string;
  onPasswordChange: (type: 'current' | 'new', value: string) => void;
  onPasswordSubmit: () => void;
  isLoading: boolean;
  error: string | null;
  editOpen: boolean;
  editClose: () => void;
  username: string;
  bio: string;
  onUserInfoChange: (type: 'username' | 'bio', value: string) => void;
  onUserInfoSubmit: () => void;
}

const Dialogs: React.FC<DialogsProps> = ({
  open,
  onClose,
  selectedFile,
  onFileChange,
  onUpload,
  deleteOpen,
  deleteClose,
  deleteId,
  onDelete,
  passwordOpen,
  passwordClose,
  currentPassword,
  newPassword,
  onPasswordChange,
  onPasswordSubmit,
  isLoading,
  error,
  editOpen,
  editClose,
  username,
  bio,
  onUserInfoChange,
  onUserInfoSubmit,
}) => {
  const theme = useTheme();
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <DialogTitle>Change Avatar</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.palette.text.primary }}>
            Please select the avatar image to upload:
          </DialogContentText>
          <input type="file" accept="image/*" onChange={onFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: theme.palette.text.primary }}>
            Cancel
          </Button>
          <Button onClick={onUpload} sx={{ color: theme.palette.text.primary }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={deleteClose}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <DialogTitle>Delete Article !</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.palette.text.primary }}>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={deleteClose}
            sx={{ color: theme.palette.text.primary }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onDelete(deleteId!)}
            sx={{ color: theme.palette.text.primary }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={passwordOpen}
        onClose={passwordClose}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => onPasswordChange('current', e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              sx: { color: theme.palette.text.primary },
            }}
            InputProps={{
              sx: { color: theme.palette.text.primary },
            }}
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => onPasswordChange('new', e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{
              sx: { color: theme.palette.text.primary },
            }}
            InputProps={{
              sx: { color: theme.palette.text.primary },
            }}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={passwordClose}
            sx={{ color: theme.palette.text.primary }}
          >
            Cancel
          </Button>
          <Button
            onClick={onPasswordSubmit}
            sx={{ color: theme.palette.text.primary }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editOpen}
        onClose={editClose}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <DialogTitle>Edit Info</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="UserName"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => onUserInfoChange('username', e.target.value)}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary },
            }}
            InputProps={{
              sx: { color: theme.palette.text.primary },
            }}
          />
          <TextField
            margin="dense"
            label="Biography"
            type="text"
            fullWidth
            variant="outlined"
            value={bio}
            onChange={(e) => onUserInfoChange('bio', e.target.value)}
            InputLabelProps={{
              sx: { color: theme.palette.text.primary },
            }}
            InputProps={{
              sx: { color: theme.palette.text.primary },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={editClose}
            sx={{ color: theme.palette.text.primary }}
          >
            Cancel
          </Button>
          <Button
            onClick={onUserInfoSubmit}
            sx={{ color: theme.palette.text.primary }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dialogs;
