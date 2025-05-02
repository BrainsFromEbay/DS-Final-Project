import { Server } from "socket.io"
import express, { Express } from "express"
import mongoose from "mongoose"
import http from "http"
import dotenv from "dotenv"

const app: Express = express()

const mongoDB: string ="mongodb://localhost:27017/chat"
mongoose.connect(mongoDB)
    .then(() => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err)
    })

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

    socket.on("send_message", (data) => {
        console.log("Message:", data)
        io.emit("receive_message", data)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id)
    })
})

server.listen(3001, () => {
    console.log("Chat Server is running on port 3001")
})