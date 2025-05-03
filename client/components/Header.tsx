import { Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import "../styles/header.css"
import Typography from "@mui/material/Typography";
import React from "react";


export const Header = () => {

    const token: string | null = localStorage.getItem('token')
    function TokenFound(){
      if (token) {
        return <div><Button onClick={handleLogOut} color="inherit">logout</Button> <Button component={Link} to="/" color="inherit">Home</Button></div>
      } else {
        return <div><Button component={Link} to="/login" color="inherit">login</Button>  <Button component={Link} to="/signup" color="inherit">signup</Button></div>
      }
    }

    const handleLogOut = () => {
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    return (
      <Box sx={{ flexGrow: 2 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Chat App
            </Typography>
              <TokenFound/>
          </Toolbar>
        </AppBar>
      </Box>
    )
  }

export default Header