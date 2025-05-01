"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logValidator = exports.regValitor = void 0;
const express_validator_1 = require("express-validator");
const regValitor = [
    (0, express_validator_1.body)("email")
        .trim()
        .escape(),
    // .isEmail(),
    (0, express_validator_1.body)("password")
    // .isLength({ min: 8 })
    //.matches(/[A-Z]/)
    //.matches(/[a-z]/)
    //.matches(/[0-9]/)
    //.matches(/[#!&?]/)
];
exports.regValitor = regValitor;
const logValidator = [
    (0, express_validator_1.body)("email")
        .trim()
        .escape()
        .isEmail(),
    (0, express_validator_1.body)("password")
        .notEmpty()
];
exports.logValidator = logValidator;
