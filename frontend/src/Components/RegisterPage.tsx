import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Tooltip,
  CircularProgress,
  Container,
  Avatar,
  CssBaseline,
  Alert,
  AlertTitle,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { RegistrationRequest } from '../Models/Auth';
import { Role } from '../Models/enums/Role';
import { UserStatus } from '../Models/enums/UserStatus';
import { registerUserThunk } from '../store/slices/auth';
import { RootState } from '../store/store';

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const error = useSelector((state: RootState) => state.auth.error);

  const [formData, setFormData] = useState<RegistrationRequest>({
    email: '',
    username: '',
    password: '',
    role: Role.User,
    userStatus: UserStatus.Active,
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'password') {
      if (!/[a-zA-Z]/.test(value)) {
        setPasswordError('Password must contain at least one letter');
      } else {
        setPasswordError(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordError) return;
    dispatch(registerUserThunk(formData));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'background.default',
          padding: 4,
          borderRadius: 2,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Tooltip title="Email is required">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              InputProps={{
                style: { color: 'text.primary' },
              }}
              InputLabelProps={{
                shrink: true,
                style: { color: 'text.primary' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'text.primary',
                  },
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'secondary.main',
                },
              }}
            />
          </Tooltip>
          <Tooltip title="Username is required">
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                style: { color: 'text.primary' },
              }}
              InputLabelProps={{
                shrink: true,
                style: { color: 'text.primary' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'text.primary',
                  },
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'secondary.main',
                },
              }}
            />
          </Tooltip>
          <Tooltip
            title="Password must contain at least one letter"
            open={!!passwordError}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                style: { color: 'text.primary' },
              }}
              InputLabelProps={{
                shrink: true,
                style: { color: 'text.primary' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'text.primary',
                  },
                  '&:hover fieldset': {
                    borderColor: 'secondary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'secondary.main',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: 'secondary.main',
                },
              }}
            />
          </Tooltip>
          <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              disabled={isLoading}
              sx={{ height: 56 }}
            >
              {isLoading ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: 'secondary.main',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                'Register'
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
