import React, { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { AuthContext } from '../auth/AuthProvider';

const defaultTheme = createTheme();

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthToken } = useContext(AuthContext);
  const { setUsername } = useContext(AuthContext);
  const { setUserId } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState('');


  const apiUrl = process.env.REACT_APP_API_URL;


  const createUserAndSignIn = async () => {
    try {
      await axios.post(`${apiUrl}/api/v1/challenge/users`, {
        username: email,
        password
      });

      handleSignIn();
    } catch (error) {
      console.error('User creation error:', error);
      setErrorMessage('Error creating user.');
    }
  };

  const handleSignIn = async (event) => {
    if (event) {
      event.preventDefault();
    }
    try {
      const response = await axios.post(`${apiUrl}/api/v1/challenge/auth`, {
        username: email,
        password
      });

      const token = response.data.token;
      setAuthToken(token);
      setUsername(response.data.name);
      setUserId(response.data.userId);
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', email);
      localStorage.setItem('userId', response.data.userId);
      setErrorMessage('');
    } catch (error) {
      console.error('Log in Error:', error);
      setErrorMessage('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Button
              type="button"
              fullWidth
              variant="outlined"
              sx={{ mt: 2, mb: 2 }}
              onClick={createUserAndSignIn}
            >
              Create Account
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
