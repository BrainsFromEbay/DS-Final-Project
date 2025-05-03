import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document{
    username: string,
    password: string,
    isAdmin: Boolean,
    createdAt: Date,
}

let userSchema: Schema = new Schema ({
    username: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: false, default: false},
    createdAt: {type: Date, default: Date.now},
})

const users: mongoose.Model<IUser> = mongoose.model<IUser>("users", userSchema)

export {users, IUser}