import React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, Typography } from '@mui/material';

function Signup() {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Function that handles the signput
  // Takes data and puts to form
  // Sends to backend
  // Backend then saves to db
  const handlebuttonSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const formData = {
      email: email,
      password: password
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEmail("");
        setPassword("");
        window.location.href = "/login"
      } else {
        console.log('Error signing in:', response);
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
        Sign up!
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
    {/* INPUT FIELDS AND BUTTONS */}
    <TextField name='email' id="standard-basic" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} variant="standard" />
    <TextField name='password' id="standard-basic" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} variant="standard" />
    <Button name="signupButton" variant="contained" color="primary" onClick={handlebuttonSubmit} fullWidth>
          Sign Up
    </Button>
    <Link href="/login" variant="body2">
      {"Already have an account? Log in!"}
  </Link>
  </Box>
  </Box>
    </>
  )
}

export default Signup