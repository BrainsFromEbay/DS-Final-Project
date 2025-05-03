"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatSocket = chatSocket;
const message_1 = require("./src/models/message");
function chatSocket(io) {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        socket.on("send_message", async (data) => {
            console.log("Message:", data);
            try {
                const newMessage = new message_1.Message({
                    username: data.username,
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
