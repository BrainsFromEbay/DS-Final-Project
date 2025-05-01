import React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, Typography } from '@mui/material';
// import { generateAndStoreKeyPair } from '../utils/keygenerate'

type TLogin = {
  email: string,
  password: string,
}

interface LoginResponse {
  token: string;
  success: boolean;
}

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();

      const newLogin: TLogin = {
        email: email,
        password: password,
      }
  
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newLogin),
        });
  
        if (response.ok) {
          setEmail("");
          setPassword("");
            const data: LoginResponse = await response.json()
              console.log(data)
              
              if(data.token) {
                  localStorage.setItem('token', data.token)
                  window.location.href = "/"
              }
        } else {
          console.log('Error logging in:', response);
        }
      } catch (error: unknown) {
        console.log(error);
      }
    };

  return (
    <>
        <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Box
            component="form"
            justifyContent="center"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '300px',
              p: 3,
              boxShadow: 3,
              borderRadius: 2,
              backgroundColor: 'white',
            }}
  >
    <TextField name='email' id="standard-basic" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} variant="standard" />
    <TextField name='password' id="standard-basic" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} variant="standard" />
    <Button id='loginButton' variant="contained" color="primary" onClick={handleLogin} fullWidth>
    Log in
    </Button>

    <Link href="/signup" variant="body2">
      Don't have an account? Sign Up
  </Link>
  </Box>
  </Box>
    </>
  )
}

export default Login