import mongoose, { Schema, type Document } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  courseId: string;
  teacherId: string;
  dueDate: Date;
  submissions: Array<{
    studentId: string;
    submittedAt: Date;
    content: string;
    grade?: number;
    feedback?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    description: { type: String },
    courseId: { type: String, required: true },
    teacherId: { type: String, required: true },
    dueDate: { type: Date, required: true },
    submissions: [
      {
        studentId: { type: String, required: true },
        submittedAt: { type: Date, default: Date.now },
        content: { type: String },
        grade: { type: Number },
        feedback: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const Assignment = mongoose.model<IAssignment>(
  "Assignment",
  assignmentSchema
);
