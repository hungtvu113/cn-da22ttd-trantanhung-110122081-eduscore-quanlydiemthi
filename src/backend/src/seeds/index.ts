import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { User, Subject, Exam, Score } from "../models";
import connectDB from "../config/db";

const seedData = async () => {
  try {
    await connectDB();
    console.log("🌱 Bắt đầu seed database...\n");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Subject.deleteMany({}),
      Exam.deleteMany({}),
      Score.deleteMany({}),
    ]);
    console.log("✅ Đã xóa dữ liệu cũ");

    // Create 1 Admin
    const admin = await User.create({
      email: "admin@gmail.com",
      password: "admin123",
      name: "Quản trị viên",
      role: "admin",
    });
    console.log("✅ Đã tạo 1 Admin");

    // Create 1 Teacher
    const teacher = await User.create({
      email: "giaovien@gmail.com",
      password: "123456",
      name: "Nguyễn Văn Giáo",
      role: "teacher",
      phone: "0901234567",
    });
    console.log("✅ Đã tạo 1 Giáo viên");

    // Create 1 Student
    const student = await User.create({
      email: "110120001@gmail.com",
      password: "123456",
      name: "Trần Thị Sinh",
      role: "student",
      studentId: "110120001",
    });
    console.log("✅ Đã tạo 1 Sinh viên");

    // Create 1 Subject
    const subject = await Subject.create({
      code: "TA01",
      name: "Tiếng Anh cơ bản",
      credits: 3,
    });
    console.log("✅ Đã tạo 1 Môn thi");

    // Create 1 Exam
    const exam = await Exam.create({
      name: "Kỳ thi Tiếng Anh - Tháng 12/2024",
      subject: subject._id,
      examDate: new Date("2024-12-25"),
      semester: "HK1",
      academicYear: "2024-2025",
      status: "completed",
      createdBy: admin._id,
    });
    console.log("✅ Đã tạo 1 Kỳ thi");

    // Create 1 Score
    await Score.create({
      student: student._id,
      exam: exam._id,
      score: 8.5,
      enteredBy: teacher._id,
      status: "published",
    });
    console.log("✅ Đã tạo 1 Điểm thi");

    console.log("\n🎉 Seed hoàn tất!");
    console.log("\n" + "=".repeat(50));
    console.log("📋 DỮ LIỆU MẪU ĐỂ TEST:");
    console.log("=".repeat(50));
    console.log("\n👤 TÀI KHOẢN:");
    console.log("   Admin:     admin / admin123");
    console.log("   Giáo viên: giaovien / 123456");
    console.log("   Sinh viên: 110120001 / 123456");
    console.log("\n📚 MÔN THI:");
    console.log("   Mã: TA01 - Tiếng Anh cơ bản (3 tín chỉ)");
    console.log("\n📝 KỲ THI:");
    console.log("   Kỳ thi Tiếng Anh - Tháng 12/2024");
    console.log("\n📊 ĐIỂM:");
    console.log("   Sinh viên 110120001: 8.5 điểm");
    console.log("\n" + "=".repeat(50));

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi seed:", error);
    process.exit(1);
  }
};

seedData();

