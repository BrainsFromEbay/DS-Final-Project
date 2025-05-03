// Model for chat rooms in the future
// import mongoose, { Document, Schema } from "mongoose";

// interface IChat extends Document {
//     name: string
//     description?: string
//     createdAt: Date
// }

// let ChatSchema: Schema<IChat> = new Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: false },
//     createdAt: { type: Date, default: Date.now },
// })

// const Chat = mongoose.model<IChat>("Message", ChatSchema)
// export { Chat, IChat }