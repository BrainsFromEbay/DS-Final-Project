import {Router, Request, Response} from "express"
import {Notes, INote, IComment} from "../models/notes"
import { compile } from "morgan"
import {users, IUser} from "../models/User"
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { regValitor, logValidator } from "../validators/inputValidation"
import dotenv from 'dotenv';
import { validateToken } from "../middleware/validateToken"
import {IColumn, Columns} from "../models/columns"
import upload from "./mulder-config"
import { IImage, images } from "../models/images"
dotenv.config();


const router: Router = Router()

// Gets data from frontend. Then finds the right user and notes
// Then pushes data to the notes comment array and to database and sends res200 to frontend
router.post('/api/addComment', validateToken, async(req: any, res: any) => {
    try {
        const user = req.user;
        const foundUser = await users.findOne({ _id: user._id });      

        let newComment: IComment = {
            text: req.body.comment,
            createdat: new Date()
        }
          
        if (!user) {
            return res.status(401).json({ message: 'Access denied.' });
            
        } else { 
            if (foundUser) {
                    const updatedNote = await Notes.findByIdAndUpdate(
                    req.body.id,
                    { $push: { comments: newComment } },
                      { new: true }
                    );
                
                return res.status(200).json({ 
                    message: 'Note status updated successfully',
                });
            } else {
                return res.status(404).json({ message: 'User not found.' });
            }
        }
    } catch (error) {
        console.error('Error updating Note status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Gets data from frontend. Then finds the right user, column and notess
// Updates the name of found column and then the statuses of all notes  under the given column
// Then pushes data to database and sends res200 to frontend
router.put('/api/changeName', validateToken, async (req: any, res: any) => {
    try {
        const user = req.user;
        const foundUser = await users.findOne({ _id: user._id });
          
        if (!user) {
            return res.status(401).json({ message: 'Access denied.' });
        } else { 
            if (foundUser) {
                await Columns.updateOne(
                    { _id: req.body.id, userid: user._id }, 
                    { $set: { name: req.body.name } }
                );
                await Notes.updateMany(
                    { status: req.body.status, userID: user._id },
                    { $set: { status: req.body.name } }
                );
                
                return res.status(200).json({ 
                    message: 'Note status updated successfully',
                });
            } else {
                return res.status(404).json({ message: 'User not found.' });
            }
        }
    } catch (error) {
        console.error('Error updating Note status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Gets data from frontend. Then finds the right user, old position, oldstatus and all notes.
// Updates the status of the right note and puts it at the last position under the given column
// Then pushes all of the old columns notes up by one position so they are not in the wrong places after update
// Then pushes data to database and sends res200 to frontend
router.put('/api/updateNoteStatus', validateToken, async (req: any, res: any) => {
    try {
        const user = req.user;
        const foundUser = await users.findOne({ _id: user._id });
        const noteForOldStatus = await Notes.findOne({ _id: req.body.id });
        const oldPosition = noteForOldStatus?.position
        const oldStatus = noteForOldStatus?.status;
        const foundNotes = await Notes.find({ userID: user._id, status: req.body.status });
        
        if (!user) {
            return res.status(401).json({ message: 'Access denied.' });
        } else { 
            if (foundUser) {
                await Notes.updateOne(
                    { _id: req.body.id }, 
                    { $set: { status: req.body.status, position: foundNotes.length } }
                );
                const notesWithNewStatus = await Notes.find({ status: req.body.status, userID: user._id });
                await Notes.updateMany(
                    { status: oldStatus, userID: user._id, position:{$gte:oldPosition} },
                    { $inc: { position: -1 } }
                );
                
                return res.status(200).json({ 
                    message: 'Note status updated successfully',
                    notesCount: notesWithNewStatus.length
                });
            } else {
                return res.status(404).json({ message: 'User not found.' });
            }
        }
    } catch (error) {
        console.error('Error updating Note status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Gets data from frontend.
// Checks if there is account on the same email already
// If yes then status 403 if not then makes hash of password
// Then takes the photo from frontend and gives it a filename and path
// Then pushes data to database and sends res200 to frontend
router.post("/api/register", upload.single("image"), //regValitor,
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)

        if (errors.isEmpty()) {
            console.log("Received body:", req.body);
            console.log("Received file:", req.file);

            
            
            try {
                let email:string = req.body.email
                let foundUser = await users.findOne({ email: email })
                console.log(foundUser);
                
                if (foundUser) {
                    res.status(403).json({email: "Email already in use"})
                } else {
                    const salt: string = bcrypt.genSaltSync(10)
                    const hash: string = bcrypt.hashSync(req.body.password, salt)
                    console.log(req.file);
                    
                    if (!req.file) {
                        
                    let newUser:IUser = new users ({
                        email: req.body.email,
                        password: hash,
                        imageId: null
                    })
                    await newUser.save()
                    res.status(200).json(newUser)
                    console.log(newUser);

                }   if (req.file) {
                    const imgPath: string = req.file.path.replace("public/", "")
                    const image: IImage = new images({
                        filename: req.file.filename,
                        path: imgPath
                    })
                    await image.save()

                    let newUser:IUser = new users ({
                        email: req.body.email,
                        password: hash,
                        imageId: image._id
                    })
                    await newUser.save()
                }
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

// Data from frontend
// Finds correct user and notes for user
// Then makes new note and pushesh it to database
// Then sends res200 and the new note to frontend
router.post('/api/addNote', validateToken, async (req:any, res:any) => {
    try {
        const user = req.user
        const foundUser = await users.findOne({ _id: user._id })
        console.log(req.body.status);
        
        const foundNotes = await Notes.find({ status: req.body.status, userID:user._id })
        //console.log(foundNotes);
        //console.log(foundNotes.length);
        
        //console.log(foundUser);
        console.log("here come stuff");        

        if (!user) {
            res.status(401).json({ message: 'Access denied.' })
            console.log("HERE PROBLEM");
            
        } else { 
            if (foundUser){
                const newNote: INote = new Notes({
                    title: req.body.title,
                    content: req.body.content,
                    createdat: Date.now(),
                    userID: user._id,
                    status: req.body.status,
                    position: foundNotes.length
                })
                await newNote.save()
                res.status(200).json({message: "Topic added", sendNote:newNote})
                }

        }
        
    } catch (error) {
        console.error('Error creating Note:', error)
        res.status(400).json({ error: 'Internal server error' })
    }
})

// Same as addnote but column
router.post('/api/addColumn', validateToken, async (req:any, res:any) => {
    try {
        const user = req.user
        const foundUser = await users.findOne({ _id: user._id })
        console.log(foundUser);
        console.log("here come stuff");        

        if (!user) {
            res.status(401).json({ message: 'Access denied.' })
            console.log("HERE PROBLEM");
            
        } else { 
            if (foundUser){
                const newColumn: IColumn = new Columns({
                    name: req.body.name,
                    userid: user._id
                })
                await newColumn.save()
                res.status(200).json({message: "Column added", sendColumn:newColumn})
                }

        }
        
    } catch (error) {
        console.error('Error creating Note:', error)
        res.status(400).json({ error: 'Internal server error' })
    }
})

// Gets all notes and columns for user
// Then sends them to frontend
router.get("/api/getNotesandColumns", validateToken, async (req: any, res: Response) => {
    try {
        const user = req.user
        let columnsList: IColumn[] = await Columns.find({userid:user})
        let notesList: INote[] = await Notes.find({ userID: user }).sort({ position: 1 });
        console.log("Offer list length:", columnsList.length)
        
        res.json({columnsList, notesList})
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Error"})
      }
})

// This is called on the header
// It calls for image that is on the user
// If it finds an image for the correct user that is in the database it sends it the correct path where it is saved
router.get("/api/getImage", validateToken, async (req: any, res: Response) => {
    try {
        console.log("CALLED");
        
        const user = req.user
        if (user) {
            console.log("work");
            
            const foundUser = await users.findOne({ _id: user._id });
            if (foundUser){
                let imageID:string|undefined = foundUser?.imageId
                if (imageID) {
                    let image: IImage|null = await images.findOne({ _id: imageID });
                    if (image) {
                        res.status(200).json({imagePath: `../public/images/${image.filename}`})
                    }
                } else {
                    res.status(500).json({message: "Error"})
                }
            } else {
                res.status(500).json({message: "Error"})
            }
        }
    } catch (err) {
        console.log("CALLED");
        console.error(err)
        res.status(500).json({message: "Error"})
      }
})

// Gets all notes
router.get("/api/getNotes", validateToken, async (req: any, res: Response) => {
    try {
        const user = req.user
        let notesList: INote[] = await Notes.find({ userID: user }).sort({ position: 1 });
        console.log("Offer list length:", notesList.length)
        
        res.json(notesList)
    } catch (err) {
        console.error(err)
        res.status(500).json({message: "Error"})
      }
})

// Deletes note
// Gets id of note to delete and then deletes
// Sends message if deletet or if error
router.delete('/api/noteDelete', async (req:Request, res:Response) => {
    try {
        console.log(req.body.id);
        
        let existingTopic = await Notes.deleteOne({_id: req.body.id})
        res.status(200).json({ message: "Topic deleted successfully." })
    } catch (error){
        res.status(200).json({ message: "Error deleting topic" })

    }
})

// Same as noteDelete but columns
router.delete('/api/deleteColumn', validateToken, async (req:any, res:Response) => {
    try {
        console.log(req.body.id);
        const user = req.user
        
        let existingNotes = await Notes.deleteMany({status: req.body.status, userID:user._id})
        let existingTopic = await Columns.deleteOne({_id: req.body.id})
        res.status(200).json({ message: "Column and notes deleted successfully." })
    } catch (error){
        res.status(200).json({ message: "Error deleting topic" })

    }
})

// This updates the id of note that is pressed also the new position and old position
// Then finds the note to switch place by its position and status and the one that is pressed by its id
// Sets the positions of each other to each other so they switch places
// Saves data to database
router.put('/api/updateNotePositionUp', validateToken, async (req:any, res:any) => {
    try {
        const user = req.user
        const foundUser = await users.findOne({ _id: user._id })
        //console.log(foundUser);
        console.log("here come stuff");

        if (!user) {
            res.status(401).json({ message: 'Access denied.' })
            console.log("HERE PROBLEM");

        } else {
            if (foundUser){
                let noteUp = await Notes.updateOne({status: req.body.updatedItems[0].status, position:req.body.position}, { $set: { position: req.body.positionLast } })
                let existingNote = await Notes.updateOne({_id: req.body.id}, { $set: { position: req.body.position } })
            }

        }

    } catch (error) {
        console.error('Error creating Note:', error)
        res.status(400).json({ error: 'Internal server error' })
    }
})

// Same as the one on top of this but in frontend stuff is the otherway around
router.put('/api/updateNotePositionDown', validateToken, async (req:any, res:any) => {
    try {
        const user = req.user
        const foundUser = await users.findOne({ _id: user._id })
        //console.log(foundUser);
        console.log("here come stuff");

        if (!user) {
            res.status(401).json({ message: 'Access denied.' })
            console.log("HERE PROBLEM");

        } else {
            if (foundUser){
                
                let noteUp = await Notes.updateOne({status: req.body.updatedItems[0].status, position:req.body.position}, { $set: { position: req.body.positionLast } })
                let existingNote = await Notes.updateOne({_id: req.body.id}, { $set: { position: req.body.position } })
            }

        }

    } catch (error) {
        console.error('Error creating Note:', error)
        res.status(400).json({ error: 'Internal server error' })
    }
})

// This is only for cypress tests
// This clears the whole database all the way
router.post("/api/clearDatabase", async (req, res) => {
    try {
      await users.deleteMany({});
      await Columns.deleteMany({});
      await Notes.deleteMany({})
      res.status(200).json({ success: true, message: "Database cleared!" })
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to clear database" })
    }
  });


export default router

