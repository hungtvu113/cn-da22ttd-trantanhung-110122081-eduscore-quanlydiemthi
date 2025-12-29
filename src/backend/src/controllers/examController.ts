import { Request, Response } from "express";
import { Exam, Score } from "../models";

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
export const getExams = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, status, semester, search } = req.query;

    // Build query
    const query: Record<string, unknown> = {};

    if (subject) query.subject = subject;
    if (status) query.status = status;
    if (semester) query.semester = semester;

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const exams = await Exam.find(query)
      .populate("subject", "code name")
      .populate("createdBy", "name email")
      .sort({ examDate: -1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error("Get exams error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách kỳ thi.",
    });
  }
};

// @desc    Get single exam
// @route   GET /api/exams/:id
// @access  Private
export const getExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("subject", "code name")
      .populate("createdBy", "name email");

    if (!exam) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy kỳ thi.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: exam,
    });
  } catch (error) {
    console.error("Get exam error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// Helper function to generate unique exam code based on exam date
const generateExamCode = async (examDate: string): Promise<string> => {
  const date = new Date(examDate);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const prefix = `EX${year}${month}`;

  // Đếm tổng số exam có prefix này và +1
  const count = await Exam.countDocuments({ code: { $regex: `^${prefix}` } });
  let sequence = count + 1;

  // Retry loop để đảm bảo unique
  let code = `${prefix}${sequence.toString().padStart(4, "0")}`;
  let exists = await Exam.findOne({ code });

  while (exists) {
    sequence++;
    code = `${prefix}${sequence.toString().padStart(4, "0")}`;
    exists = await Exam.findOne({ code });
  }

  return code;
};

// @desc    Create exam
// @route   POST /api/exams
// @access  Private (Admin)
export const createExam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, subject, examDate, startTime, endTime, room, duration, semester, academicYear, status, description } =
      req.body;

    // Generate unique exam code based on exam date
    const code = await generateExamCode(examDate);

    const exam = await Exam.create({
      code,
      name,
      subject,
      examDate,
      startTime: startTime || "08:00",
      endTime: endTime || "10:00",
      room,
      duration,
      semester,
      academicYear,
      status: status || "upcoming",
      description,
      createdBy: req.user?._id,
    });

    const populatedExam = await Exam.findById(exam._id)
      .populate("subject", "code name")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Tạo kỳ thi thành công!",
      data: populatedExam,
    });
  } catch (error) {
    console.error("Create exam error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo kỳ thi.",
    });
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private (Admin)
export const updateExam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, subject, examDate, startTime, endTime, room, duration, semester, academicYear, status, description } =
      req.body;

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { name, subject, examDate, startTime, endTime, room, duration, semester, academicYear, status, description },
      { new: true, runValidators: true }
    )
      .populate("subject", "code name")
      .populate("createdBy", "name email");

    if (!exam) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy kỳ thi.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật kỳ thi thành công!",
      data: exam,
    });
  } catch (error) {
    console.error("Update exam error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật kỳ thi.",
    });
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private (Admin)
export const deleteExam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);

    if (!exam) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy kỳ thi.",
      });
      return;
    }

    // Cascade delete: Xóa tất cả điểm liên quan đến kỳ thi này
    await Score.deleteMany({ exam: req.params.id });

    res.status(200).json({
      success: true,
      message: "Xóa kỳ thi và điểm liên quan thành công!",
    });
  } catch (error) {
    console.error("Delete exam error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa kỳ thi.",
    });
  }
};

