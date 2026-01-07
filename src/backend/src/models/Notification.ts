import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  type: "exam" | "score" | "class" | "system";
  targetUser?: mongoose.Types.ObjectId; // null = thông báo chung, có giá trị = thông báo riêng
  relatedId?: mongoose.Types.ObjectId;
  relatedModel?: "Exam" | "Score" | "Class";
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề thông báo là bắt buộc"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Nội dung thông báo là bắt buộc"],
    },
    type: {
      type: String,
      enum: ["exam", "score", "class", "system"],
      default: "system",
    },
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = thông báo chung cho tất cả
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
    relatedModel: {
      type: String,
      enum: ["Exam", "Score", "Class"],
    },
    readBy: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true,
  }
);

// Index để query nhanh hơn
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ targetUser: 1 });

export default mongoose.model<INotification>("Notification", notificationSchema);
