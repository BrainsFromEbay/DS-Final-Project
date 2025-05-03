import { useEffect, useState, useRef } from 'react'
import TextField from '@mui/material/TextField';
import { Box, Button, Typography } from '@mui/material';
import { io, Socket } from "socket.io-client"
import React from 'react';
import { Message } from '../../chatServer/src/models/message'
import {  jwtDecode } from "jwt-decode"
import dotenv from 'dotenv'

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3001'; //TÄHÄN BACKEND URL
//TODO: currently the chatbar goes down with the messages, fix this
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

    //socketRef is used to store the socket connection
    const socketRef = useRef<Socket | null>(null)

    useEffect(() => {
      const storedToken = localStorage.getItem('token');
    
      if (!storedToken) {
        setToken(null)
        return
      }

    setToken(storedToken)

    try{
      const decodedToken: {username: string} = jwtDecode(storedToken)
      setUsername(decodedToken.username) //get the username from the token
    } catch (error) {
      console.error("Token decode failed", error)
    }
   } ,[])
    useEffect(() => {
      if (!socketRef.current) {
        const token = localStorage.getItem('token')
        socketRef.current = io(URL, {
          auth: {
            token: token,
          }
        })

        const socket = socketRef.current

        socket.on("receive_message", (data: Message) => {
          setMessages((prevMessages)=> [...prevMessages, data])
        })
        return () => {
          socket.off("receive_message")
          socket.disconnect()
          socketRef.current = null
        }
      }
    }, [])

    const sendMessage = () => {
      if (!message.trim()) return; // Check that message is not empty
      
      const newMessage: Message = {
        text: message,
        username: username || 'Anon', // Default to 'Anon' if username is empty
      }
      
      socketRef.current?.emit("send_message", newMessage);
      
      setMessage('')
    };
    
      useEffect(() => {
        //if (!token) return;

        fetch("http://localhost:3001/api/messages")
          .then(response => response.json())
          .then(data => {
            setMessages(data);
          })
          .catch(err => console.error("Failed to load messages", err));
        }, [token])
  
  return (
    <><Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="90vh"
      paddingTop="10px"
    >
      {}
      <Box width="100%" maxWidth="600px" flexGrow={1} overflow="auto" mb={2} border="1px solid #ccc" borderRadius="4px">
        {messages.map((msg, index) => (
          <Typography key={msg._id || index} variant="body1">
            <strong>{msg.username || 'Anon'}:</strong> {msg.text}
          </Typography>
        ))}
      </Box>
      <Box 
      width= "100%"
      maxWidth="600px"
      display="flex"
    
      gap={2}
      p={2}
    >
        <TextField name='message' id="standard-basic" label="message" value={message} onChange={(e) => setMessage(e.target.value)} variant="standard" fullWidth/>
        <Button id='sendMessage' variant="contained" color="primary" onClick={sendMessage}>
          Send message
        </Button>
      </Box>
      

    </Box></>
  )
}

export default Home
