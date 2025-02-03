import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';

function Login({ setToken, setUsername }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });
      setToken(res.data.token);
      setUsername(res.data.username);
      localStorage.setItem('token', res.data.token);
      navigate('/chat'); // Redirect to chat after login
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth='xs' style={{ marginTop: '100px' }}>
      <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant='h5' gutterBottom>
          Login
        </Typography>
        {error && <Typography color='error'>{error}</Typography>}
        <TextField
          fullWidth
          label='Email'
          margin='normal'
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label='Password'
          type='password'
          margin='normal'
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant='contained'
          color='primary'
          fullWidth
          onClick={handleLogin}
          style={{ marginTop: '10px' }}
        >
          Login
        </Button>
      </Paper>
    </Container>
  );
}

export default Login;
