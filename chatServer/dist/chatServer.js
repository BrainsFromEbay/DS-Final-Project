"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket");
const chat_1 = __importDefault(require("./src/routes/chat"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: 'http://localhost:3003',
    optionsSuccessStatus: 200
};
const mongoDB = "mongodb://127.0.0.1:27017/chat";
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
        origin: "http://localhost:3003", // lisää tähän frontend URL
        methods: ["GET", "POST"],
        credentials: true,
    }
});
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", chat_1.default);
(0, socket_1.chatSocket)(io);
server.listen(3001, () => {
    console.log("Chat Server is running on port 3001");
});
