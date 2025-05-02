import {Request, Response, Router} from 'express'
import { Message } from '../models/message'

const router: Router = Router()


// Get all messages from the database
router.get("/api/messages", async (req: Request, res: Response) => {
    try {
        const messages = await Message.find()
        .sort({ createdAt: -1 }) // Sort by createdAt in descending order
        .limit(50)
    
        res.status(200).json(messages)
        return
    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
    }
})

export default router