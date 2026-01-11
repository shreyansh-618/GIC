import mongoose, { Schema, type Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  teacherId: string;
  videoUrl: string;
  notesUrl?: string;
  students: string[];
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String },
    teacherId: { type: String, required: true },
    videoUrl: { type: String, required: true },
    notesUrl: { type: String },
    students: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
