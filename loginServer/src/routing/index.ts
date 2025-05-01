import {Router, Request, Response} from "express"
import { users, IUser} from '../models/User'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { regValitor, logValidator } from "../validators/inputValidation"
import dotenv from 'dotenv';
import { validateToken } from "../middleware/validateToken"
dotenv.config();


const router: Router = Router()


// Gets data from frontend.
// Checks if there is account on the same email already
// If yes then status 403 if not then makes hash of password
// Then takes the photo from frontend and gives it a filename and path
// Then pushes data to database and sends res200 to frontend
router.post("/api/register", //regValitor,
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)

        if (errors.isEmpty()) {
            console.log("Received body:", req.body);
            
            try {
                let email:string = req.body.email
                let foundUser = await users.findOne({ email: email })
                console.log(foundUser);
                
                if (foundUser) {
                    res.status(403).json({email: "Email already in use"})
                } else {
                    const salt: string = bcrypt.genSaltSync(10)
                    const hash: string = bcrypt.hashSync(req.body.password, salt)   
                    let newUser:IUser = new users ({
                        email: req.body.email,
                        password: hash,
                    })
                    await newUser.save()
                    res.status(200).json(newUser)
                    console.log(newUser);
            }
                
        } catch (error: any) {
            console.error(`Error during registeration: ${error}`)
            res.status(500).json({error : "Internal server error"})
        }
        } else {
            console.log(errors)
            res.status(400).json({errors: errors.array()})
        }
    }
)

// Gets data from frontend
// Then checks if email is the same
// If not do not continue and sends 401
// If yes then check if hash is good
// If yes then send token to frontend
// If no then error
router.post("/api/login", //logValidator,
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)
        
        if (errors.isEmpty()) {
        try {
            let email:string = req.body.email
            const foundUser = await users.findOne({ email: email })
            
            if (foundUser) {
                if (bcrypt.compareSync(req.body.password, foundUser.password)){
                    const JwtPayload: JwtPayload = {
                        _id: foundUser._id,
                        isAdmin: foundUser.isAdmin
                    }
                    const token: string = jwt.sign(JwtPayload, process.env.SECRET as string, {expiresIn: "30m"})
                    res.status(200).json({success: true, token})
                } else {
                    res.status(401).json({message: "Login failed"})
                }
            } else { 
                res.status(401).json({ message: "Login failed"})
            }

        } catch (error: any) {
            console.error(`Error during registeration: ${error}`)
            res.status(500).json({error : "Internal server error"})
        }
        } else {
            console.log(errors)
            res.status(400).json({errors: errors.array()})
        }

})

export default router

