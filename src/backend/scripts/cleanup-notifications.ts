// Script để xóa thông báo kỳ thi có môn (dữ liệu cũ sai)
// Chạy: npx ts-node scripts/cleanup-notifications.ts

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/eduscore";

async function cleanup() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    if (!db) {
      console.error("Database connection not established");
      process.exit(1);
    }

    // Xóa thông báo kỳ thi có môn (message bắt đầu bằng "Môn")
    const result = await db.collection("notifications").deleteMany({
      type: "exam",
      message: { $regex: /^Môn/ }
    });

    console.log(`Đã xóa ${result.deletedCount} thông báo kỳ thi có môn`);

    await mongoose.disconnect();
    console.log("Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

cleanup();
