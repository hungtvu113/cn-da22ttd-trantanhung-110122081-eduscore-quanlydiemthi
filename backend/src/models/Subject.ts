import mongoose, { Document, Schema } from "mongoose";

export interface ISubject extends Document {
  _id: mongoose.Types.ObjectId;
  code: string; // Mã môn thi (VD: ENG101, IT201)
  name: string; // Tên môn thi
  description?: string;
  credits?: number; // Số tín chỉ
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const subjectSchema = new Schema<ISubject>(
  {
    code: {
      type: String,
      required: [true, "Mã môn thi là bắt buộc"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Tên môn thi là bắt buộc"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    credits: {
      type: Number,
      min: [1, "Số tín chỉ phải lớn hơn 0"],
      max: [10, "Số tín chỉ không được quá 10"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries (code already indexed via unique: true)
subjectSchema.index({ name: "text" });

export default mongoose.model<ISubject>("Subject", subjectSchema);

