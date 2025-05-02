"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const mongoDB = "mongodb://localhost:27017/chat";
mongoose_1.default.connect(mongoDB)
    .then(() => {
    console.log("Connected to MongoDB");
})
    .catch((err) => {
    console.error("MongoDB connection error:", err);
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("send_message", (data) => {
        console.log("Message:", data);
        io.emit("receive_message", data);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
server.listen(3001, () => {
    console.log("Chat Server is running on port 3001");
});
