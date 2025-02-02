import React, { useState } from 'react';
import axios from 'axios';

function Register({ setShowLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });

      setMessage(res.data.message);
      setTimeout(() => setShowLogin(true), 2000); // Redirect to login after success
    } catch (error) {
      setMessage(
        'Registration failed: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <input
        type='text'
        placeholder='Username'
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type='email'
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>
        Already have an account?{' '}
        <button onClick={() => setShowLogin(true)}>Login</button>
      </p>
    </div>
  );
}

export default Register;
