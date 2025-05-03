"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_1 = require("../models/message");
const router = (0, express_1.Router)();
// Get all messages from the database
router.get("/api/messages", async (req, res) => {
    try {
        const messages = await message_1.Message.find()
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .limit(50);
        res.status(200).json(messages);
        return;
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
