import mongoose, { Document, Schema } from "mongoose";

// CHECK COLUMNS.ts

interface IComment{
    text: string,
    createdat: Date
}


interface INote extends Document{
    title: string,
    content: string,
    createdat: Date,
    userID: string,
    status: string,
    position: number,
    comments: IComment[]
}

let commentSchema: Schema = new Schema ({
    text: {type: String, required: true},
    createdat: {type: Date, default: Date.now}
})

let noteSchema: Schema = new Schema ({
    title: {type: String, required: true},
    content: {type : String, required: true},
    createdat: {type: Date, default: Date.now},
    userID: {type: String, required: true},
    status: {type: String,},
    position: {type: Number, required: true},
    comments: {type: [commentSchema], default: []}

})

const Notes: mongoose.Model<INote> = mongoose.model<INote>("Notes", noteSchema)

export {Notes, INote, IComment}

