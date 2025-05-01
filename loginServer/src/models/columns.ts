import mongoose, { Document, Schema } from "mongoose";
import { Notes } from "./notes";

// This is the model for column
// This is used in the database

// Defines structure
interface IColumn extends Document{
    name: string,
    userid: string,
}

/**
 * Mongoose schema definition for the Column model
 * Specifies the fields, their types, and validation requirements
 */
let columnSchema: Schema = new Schema ({
    name: {type: String, required: true},
    userid: {type: String, required: true},
})

/**
 * Mongoose model for Column documents
 */
const Columns: mongoose.Model<IColumn> = mongoose.model<IColumn>("Columns", columnSchema)

export {Columns, IColumn}

