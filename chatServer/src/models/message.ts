import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
    username: string
    text: string
    createdAt: Date
}

let MessageSchema: Schema<IMessage> = new Schema({
    username: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
})

const Message = mongoose.model<IMessage>("Message", MessageSchema)
export { Message, IMessage }