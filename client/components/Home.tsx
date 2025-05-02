import { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { Box, Button, Typography } from '@mui/material';
import { io } from "socket.io-client"
import React from 'react';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4000'; //TÄHÄN BACKEND URL

interface Message {
  _id?: string;
  username?: string;
  text: string;
  timestamp?: string;
}

function Home() {

    const [message, setMessage] = useState<string>('');
    const [token, setToken] = useState<string | null>(null)
    const [username, setUsername] = useState<string>("")
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        window.location.href = '/login'
        return
      };
      setToken(storedToken)
    }, []);

    if (!token) {return}

    const socket = io(URL)

    const sendMessage = () => {
      socket.emit("send_message", { text: message, username: username});
      setMessage("")
    };
    
      useEffect(() => {
        fetch("/api/messages")
          .then(response => response.json())
          .then(data => {
            setMessages(data);
          })
          .catch(err => console.error("Failed to load messages", err));

      socket.on("receive_message", (data: Message) => {
        setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
        socket.off("receive_message");
      };
    }, []);

  
  return (
    <><Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <div>
      <Box width="100%" maxWidth="600px" mb={2}>
        {messages.map((msg, index) => (
          <Typography key={msg._id || index} variant="body1">
            <strong>{msg.username || 'Anon'}:</strong> {msg.text}
          </Typography>
        ))}
      </Box>
        <TextField name='message' id="standard-basic" label="message" value={message} onChange={(e) => setMessage(e.target.value)} variant="standard" />
        <TextField name='username' id="standard-basic" label="username" value={username} onChange={(e) => setUsername(e.target.value)} variant="standard" />
        <Button id='sendMessage' variant="contained" color="primary" onClick={sendMessage} fullWidth>
          Send message
        </Button>
      </div>
    </Box></>
  )
}

export default Home
