import mongoose, { Schema, type Document } from "mongoose";

export interface ICertificate extends Document {
  studentId: string;
  courseId: string;
  issuedAt: Date;
  certificateUrl: string;
  createdAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    studentId: { type: String, required: true },
    courseId: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    certificateUrl: { type: String },
  },
  { timestamps: true }
);

export const Certificate = mongoose.model<ICertificate>(
  "Certificate",
  certificateSchema
);
