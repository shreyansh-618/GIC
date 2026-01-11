import mongoose, { Schema, type Document } from "mongoose";

export interface IAccessCode extends Document {
  code: string;
  teacherId: string;
  email: string;
  isUsed: boolean;
  usedAt?: Date;
  expiresAt: Date;
  createdBy: string;
  createdAt: Date;
}

const accessCodeSchema = new Schema<IAccessCode>(
  {
    code: { type: String, required: true, unique: true },
    teacherId: { type: String, required: true },
    email: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date },
    expiresAt: { type: Date, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export const AccessCode = mongoose.model<IAccessCode>(
  "AccessCode",
  accessCodeSchema
);
