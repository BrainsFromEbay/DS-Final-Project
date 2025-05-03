"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocket = chatSocket;
const message_1 = require("./src/models/message");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function chatSocket(io) {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("send_message", async (data) => {
            console.log("Message:", data);
            console.log(socket);
            try {
                const token = socket.handshake.auth.token;
                console.log("Token:", token);
                const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET);
                console.log("Decoded token:", decodedToken);
                const newMessage = new message_1.Message({
                    username: decodedToken.username,
                    text: data.text,
                    createdAt: new Date(),
                });
                const savedMessage = await newMessage.save();
                io.emit("receive_message", savedMessage);
            }
            catch (error) {
                console.error("Error saving message:", error);
            }
        });
        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}
