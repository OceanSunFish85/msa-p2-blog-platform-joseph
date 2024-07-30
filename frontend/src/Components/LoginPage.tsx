import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CssBaseline,
  Avatar,
  CircularProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { LoginRequest } from '../Models/Auth';
import { login } from '../store/slices/auth';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const credentials: LoginRequest = { Email: email, Password: password };
    dispatch(login(credentials));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
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
          Sign in
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleEmailChange}
            InputProps={{
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
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
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
            }}
          />
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
