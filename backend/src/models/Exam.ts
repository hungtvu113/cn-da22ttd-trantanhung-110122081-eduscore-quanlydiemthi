import mongoose, { Document, Schema } from "mongoose";

export interface IExam extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; // Tên kỳ thi
  subject: mongoose.Types.ObjectId; // Môn thi
  examDate: Date; // Ngày thi
  startTime: string; // Giờ bắt đầu (HH:mm)
  endTime: string; // Giờ kết thúc (HH:mm)
  duration: number; // Thời gian thi (phút) - tự động tính từ startTime và endTime
  room?: string; // Phòng thi
  semester: string; // Học kỳ (VD: "HK1 2024-2025")
  academicYear: string; // Năm học
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  description?: string;
  createdBy: mongoose.Types.ObjectId; // Admin tạo
  createdAt: Date;
  updatedAt: Date;
}

const examSchema = new Schema<IExam>(
  {
    name: {
      type: String,
      required: [true, "Tên kỳ thi là bắt buộc"],
      trim: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Môn thi là bắt buộc"],
    },
    examDate: {
      type: Date,
      required: [true, "Ngày thi là bắt buộc"],
    },
    startTime: {
      type: String,
      default: "08:00",
      trim: true,
    },
    endTime: {
      type: String,
      default: "10:00",
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      default: 90, // Mặc định 90 phút
      min: [15, "Thời gian thi tối thiểu 15 phút"],
      max: [300, "Thời gian thi tối đa 300 phút"],
    },
    semester: {
      type: String,
      required: [true, "Học kỳ là bắt buộc"],
      trim: true,
    },
    academicYear: {
      type: String,
      required: [true, "Năm học là bắt buộc"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    description: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
examSchema.index({ subject: 1 });
examSchema.index({ examDate: 1 });
examSchema.index({ status: 1 });
examSchema.index({ semester: 1, academicYear: 1 });

export default mongoose.model<IExam>("Exam", examSchema);

