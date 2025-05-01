import { body, validationResult } from "express-validator";

const regValitor = [
  body("email")
    .trim()
    .escape(),
    // .isEmail(),
  body("password")
    // .isLength({ min: 8 })
    //.matches(/[A-Z]/)
    //.matches(/[a-z]/)
    //.matches(/[0-9]/)
    //.matches(/[#!&?]/)
]

const logValidator = [
  body("email")
    .trim()
    .escape()
    .isEmail(),
  body("password")
    .notEmpty()
]


export {regValitor, logValidator}