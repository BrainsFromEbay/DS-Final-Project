import mongoose, { Document, Schema } from "mongoose";

// CHECK COLUMNS.ts

interface IImage extends Document {
    filename: string
    path: string
  }
  
  let ImageSchema: Schema = new Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
  })
  
  const images: mongoose.Model<IImage> = mongoose.model<IImage>('images', ImageSchema)
  
  export {images, IImage}