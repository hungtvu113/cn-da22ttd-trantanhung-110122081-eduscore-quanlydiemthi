import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db";

const clearDatabase = async () => {
  try {
    await connectDB();

    console.log("🗑️  Đang xóa tất cả dữ liệu...\n");

    // Get all collections
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }
    const collections = await db.collections();

    for (const collection of collections) {
      const count = await collection.countDocuments();
      await collection.deleteMany({});
      console.log(`   ✅ Đã xóa ${count} documents từ collection: ${collection.collectionName}`);
    }

    console.log("\n🎉 Đã xóa sạch database!");
    console.log("\n📋 Lưu ý:");
    console.log("   - Để tạo tài khoản Admin, thêm trực tiếp vào MongoDB Atlas");
    console.log("   - Để tạo tài khoản Giáo viên, Admin thêm từ Dashboard");
    console.log("   - Sinh viên tự đăng ký qua form đăng ký");

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi xóa database:", error);
    process.exit(1);
  }
};

clearDatabase();

