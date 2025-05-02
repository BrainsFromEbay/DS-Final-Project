import mongoose, { Schema, Document, StringSchemaDefinition } from 'mongoose'

interface IMessage extends Document {
    id?: string
    username?: string
    text: string
    timestamp?: Date
    
}

const MessageSchema: Schema = new Schema({
    id: { type: String, required: false},
    username: { type: String, required: false },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
})

const message: mongoose.Model<IMessage> = mongoose.model<IMessage>("message", MessageSchema)

export {message, IMessage}