import mongoose, { Document, Schema } from "mongoose";

export interface IClass extends Document {
  _id: mongoose.Types.ObjectId;
  code: string; // Mã lớp (VD: ENG101-A, IT201-B)
  name: string; // Tên lớp
  subject: mongoose.Types.ObjectId; // Môn học
  teacher: mongoose.Types.ObjectId; // Giáo viên phụ trách
  students: mongoose.Types.ObjectId[]; // Danh sách sinh viên
  exams: mongoose.Types.ObjectId[]; // Danh sách kỳ thi của lớp
  semester: string; // Học kỳ (VD: "HK1")
  academicYear: string; // Năm học (VD: "2024-2025")
  schedule?: string; // Lịch học (VD: "Thứ 2, 4, 6 - 8:00-10:00")
  room?: string; // Phòng học
  maxStudents: number; // Số sinh viên tối đa
  password: string; // Mật khẩu để sinh viên tham gia lớp
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    code: {
      type: String,
      required: [true, "Mã lớp là bắt buộc"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Tên lớp là bắt buộc"],
      trim: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: [true, "Môn học là bắt buộc"],
    },
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Giáo viên phụ trách là bắt buộc"],
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    exams: [
      {
        type: Schema.Types.ObjectId,
        ref: "Exam",
      },
    ],
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
    schedule: {
      type: String,
      trim: true,
    },
    room: {
      type: String,
      trim: true,
    },
    maxStudents: {
      type: Number,
      default: 50,
      min: [1, "Số sinh viên tối thiểu là 1"],
      max: [200, "Số sinh viên tối đa là 200"],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu lớp là bắt buộc"],
      minlength: [4, "Mật khẩu tối thiểu 4 ký tự"],
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

// Indexes
classSchema.index({ subject: 1 });
classSchema.index({ teacher: 1 });
classSchema.index({ students: 1 });
classSchema.index({ semester: 1, academicYear: 1 });
classSchema.index({ code: 1 });

export default mongoose.model<IClass>("Class", classSchema);

