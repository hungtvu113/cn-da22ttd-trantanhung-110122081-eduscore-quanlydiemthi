import mongoose, { Document, Schema } from "mongoose";

export interface IScore extends Document {
  _id: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId; // Học viên
  exam: mongoose.Types.ObjectId; // Kỳ thi
  score: number; // Điểm (0-10)
  grade: string; // Xếp loại (A, B, C, D, F)
  status: "pending" | "entered" | "verified" | "published";
  enteredBy: mongoose.Types.ObjectId; // Giáo viên nhập điểm
  enteredAt: Date;
  verifiedBy?: mongoose.Types.ObjectId; // Admin xác nhận
  verifiedAt?: Date;
  note?: string; // Ghi chú
  createdAt: Date;
  updatedAt: Date;
}

const scoreSchema = new Schema<IScore>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Học viên là bắt buộc"],
    },
    exam: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Kỳ thi là bắt buộc"],
    },
    score: {
      type: Number,
      required: [true, "Điểm là bắt buộc"],
      min: [0, "Điểm không được nhỏ hơn 0"],
      max: [10, "Điểm không được lớn hơn 10"],
    },
    grade: {
      type: String,
      enum: ["A", "B", "C", "D", "F"],
    },
    status: {
      type: String,
      enum: ["pending", "entered", "verified", "published"],
      default: "entered",
    },
    enteredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enteredAt: {
      type: Date,
      default: Date.now,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: Date,
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate grade before saving
scoreSchema.pre("save", function () {
  const score = this.score;
  if (score >= 8.5) this.grade = "A";
  else if (score >= 7.0) this.grade = "B";
  else if (score >= 5.5) this.grade = "C";
  else if (score >= 4.0) this.grade = "D";
  else this.grade = "F";
});

// Unique constraint: one student can have only one score per exam
scoreSchema.index({ student: 1, exam: 1 }, { unique: true });
scoreSchema.index({ exam: 1 });
scoreSchema.index({ status: 1 });

export default mongoose.model<IScore>("Score", scoreSchema);

