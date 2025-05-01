import { Request, Response, NextFunction } from "express"
import jwt, {JwtPayload} from "jsonwebtoken"


interface CustomRequest extends Request {
    user?: JwtPayload
}

// Function to validate that the token is good
export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    // Extract the token from the header
    const token: string | undefined = req.header('Authorization')?.split(" ")[1]
    

    // If no token error
    if (!token) {res.status(401).json({message: "Token not found.", error:true})}
    else {
        // console.log("HERE");
        
        try {
            // Verifies the token. Sees that it has the same env secret so its good
            const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
            // Attaches the verified payload
            req.user = verified
            // console.log(verified);
            
            // console.log("Verified user:", verified)


            // Calls to next function
            next()

        } catch (error: any) {
            console.log(error);
            
            res.status(401).json ({message: "Access denied, missing token", error:true})
        }

    }
}


// **********************************************
// **********************************************
// **************NOT IN USE**********************
// **********************************************
// **********************************************

// export const adminValidateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
//     const token: string | undefined = req.header('authorization')?.split(" ")[1]

//     if(!token) {res.status(401).json({message: "Token not found."})}
//     else{
//         try {
//             const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
//             if (verified.isAdmin == false) {
//                 res.status(403).json({message: "Access denied."})
//             } else {
//                 req.user = verified
//                 next()
//             }
    
//         } catch (error: any) {
//             res.status(401).json({message: "Missing token"})
//         }
//     }
// }


