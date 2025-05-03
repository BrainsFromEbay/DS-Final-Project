import { Server } from "socket.io"
import express, { Express } from "express"
import mongoose from "mongoose"
import http from "http"
import dotenv from "dotenv"
import { chatSocket } from "./socket"
import chatRouter from "./src/routes/chat"
import cors, {CorsOptions} from "cors"

const app: Express = express()

const CorsOptions: CorsOptions = {
    origin: "http://localhost:3003", // lisää tähän frontend URL
    optionsSuccessStatus: 200,
}

const mongoDB: string ="mongodb://127.0.0.1:27017/chat"
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
        origin: "http://localhost:3003", // lisää tähän frontend URL
        methods: ["GET", "POST"],
        credentials: true,
        
    }
})

app.use(cors(CorsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api", chatRouter)

chatSocket(io) 

server.listen(3001, () => {
    console.log("Chat Server is running on port 3001")
})