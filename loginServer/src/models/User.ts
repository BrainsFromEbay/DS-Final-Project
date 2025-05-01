import mongoose, { Document, Schema } from "mongoose";

// CHECK COLUMNS.ts

interface IUser extends Document{
    email: string,
    password: string,
    isAdmin: Boolean,
    createdAt: Date,
}

let userSchema: Schema = new Schema ({
    email: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: false, default: false},
    createdAt: {type: Date, default: Date.now},
})

const users: mongoose.Model<IUser> = mongoose.model<IUser>("users", userSchema)

export {users, IUser}