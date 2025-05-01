"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Function to validate that the token is good
const validateToken = (req, res, next) => {
    // Extract the token from the header
    const token = req.header('Authorization')?.split(" ")[1];
    // If no token error
    if (!token) {
        res.status(401).json({ message: "Token not found.", error: true });
    }
    else {
        // console.log("HERE");
        try {
            // Verifies the token. Sees that it has the same env secret so its good
            const verified = jsonwebtoken_1.default.verify(token, process.env.SECRET);
            // Attaches the verified payload
            req.user = verified;
            // console.log(verified);
            // console.log("Verified user:", verified)
            // Calls to next function
            next();
        }
        catch (error) {
            console.log(error);
            res.status(401).json({ message: "Access denied, missing token", error: true });
        }
    }
};
exports.validateToken = validateToken;
