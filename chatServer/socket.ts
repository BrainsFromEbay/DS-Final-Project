import {Server, Socket} from "socket.io"
import { Message } from "./src/models/message"

function chatSocket(io: Server) {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id)
    
        socket.on("send_message", async (data) => {
            console.log("Message:", data)

            try {
                const newMessage = new Message({
                    username: data.username,
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