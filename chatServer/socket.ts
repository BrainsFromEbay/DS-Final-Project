import {Server, Socket} from "socket.io"
import { Message } from "./src/models/message"
import jwt, {JwtPayload}from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

function chatSocket(io: Server) { 
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id)
    
        socket.on("send_message", async (data) => {
            console.log("Message:", data)

            try {
                const token = socket.handshake.auth.token
                console.log("Token:", token)
                const decodedToken = jwt.verify(token, process.env.SECRET as string) as JwtPayload
                console.log("Decoded token:", decodedToken)
                const newMessage = new Message({
                    username: decodedToken.username,
                    text: data.text,
                    createdAt: new Date(),
                })

                const savedMessage = await newMessage.save()
            
                io.emit("receive_message", savedMessage)
            } catch (error) {
                console.error("Error saving message:", error)
            }
        })
    
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id)
        })
    })
}

export {chatSocket}