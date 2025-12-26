import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: "admin" | "teacher" | "student";
  studentId?: string; // Mã sinh viên (chỉ cho student)
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false, // Không trả về password khi query
    },
    name: {
      type: String,
      required: [true, "Tên là bắt buộc"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true, // Cho phép null/undefined
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
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

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for faster queries (email and studentId already indexed via unique: true)
userSchema.index({ role: 1 });

export default mongoose.model<IUser>("User", userSchema);

