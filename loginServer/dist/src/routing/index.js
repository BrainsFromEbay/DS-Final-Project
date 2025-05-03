"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
// Gets data from frontend.
// Checks if there is account on the same email already
// If yes then status 403 if not then makes hash of password
// Then takes the photo from frontend and gives it a filename and path
// Then pushes data to database and sends res200 to frontend
router.post("/api/register", //regValitor,
async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        console.log("Received body:", req.body);
        try {
            let username = req.body.username;
            let foundUser = await User_1.users.findOne({ username: username });
            console.log(foundUser);
            if (foundUser) {
                res.status(403).json({ email: "Username already in use" });
            }
            else {
                const salt = bcrypt_1.default.genSaltSync(10);
                const hash = bcrypt_1.default.hashSync(req.body.password, salt);
                let newUser = new User_1.users({
                    username: req.body.username,
                    password: hash,
                });
                await newUser.save();
                res.status(200).json(newUser);
                console.log(newUser);
            }
        }
        catch (error) {
            console.error(`Error during registeration: ${error}`);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    else {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
    }
});
// Gets data from frontend
// Then checks if email is the same
// If not do not continue and sends 401
// If yes then check if hash is good
// If yes then send token to frontend
// If no then error
router.post("/api/login", //logValidator,
async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (errors.isEmpty()) {
        try {
            const username = req.body.username;
            const foundUser = await User_1.users.findOne({ username: username });
            if (foundUser) {
                if (bcrypt_1.default.compareSync(req.body.password, foundUser.password)) {
                    const JwtPayload = {
                        _id: foundUser._id,
                        username: foundUser.username,
                        isAdmin: foundUser.isAdmin
                    };
                    const token = jsonwebtoken_1.default.sign(JwtPayload, process.env.SECRET, { expiresIn: "30m" });
                    res.status(200).json({ success: true, token });
                }
                else {
                    res.status(401).json({ message: "Login failed" });
                }
            }
            else {
                res.status(401).json({ message: "Login failed" });
            }
        }
        catch (error) {
            console.error(`Error during registeration: ${error}`);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    else {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
    }
});
exports.default = router;
