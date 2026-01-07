import { Request, Response } from "express";
import { Exam, Score, Notification } from "../models";

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

    // Chỉ tạo thông báo CHUNG khi kỳ thi KHÔNG có môn (kỳ thi chung)
    // Kỳ thi có môn sẽ được thông báo riêng khi thêm vào lớp
    if (!subject) {
      const examDateFormatted = new Date(examDate).toLocaleDateString("vi-VN");
      
      await Notification.create({
        title: `Kỳ thi mới: ${name}`,
        message: `Ngày thi: ${examDateFormatted}${room ? ` - Phòng: ${room}` : ""}`,
        type: "exam",
        relatedId: exam._id,
        relatedModel: "Exam",
      });
    }

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


// @desc    Get public exams (kỳ thi chung - không có môn)
// @route   GET /api/exams/public
// @access  Public
export const getPublicExams = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    // Lấy các kỳ thi chung (không có môn hoặc subject = null) và còn upcoming
    const exams = await Exam.find({
      $or: [
        { subject: { $exists: false } },
        { subject: null },
      ],
      status: { $in: ["upcoming", "ongoing"] },
    })
      .populate("participants", "name studentId")
      .sort({ examDate: 1 });

    res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });
  } catch (error) {
    console.error("Get public exams error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách kỳ thi.",
    });
  }
};

// @desc    Register for public exam (đăng ký kỳ thi chung)
// @route   POST /api/exams/:id/register
// @access  Private (Student)
export const registerExam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const examId = req.params.id;
    const studentId = req.user?._id;

    const exam = await Exam.findById(examId);

    if (!exam) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy kỳ thi.",
      });
      return;
    }

    // Kiểm tra có phải kỳ thi chung không
    if (exam.subject) {
      res.status(400).json({
        success: false,
        message: "Đây không phải kỳ thi chung. Vui lòng tham gia qua lớp học.",
      });
      return;
    }

    // Kiểm tra đã đăng ký chưa
    if (exam.participants.some((p) => p.toString() === studentId?.toString())) {
      res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký kỳ thi này rồi.",
      });
      return;
    }

    // Kiểm tra số lượng
    if (exam.maxParticipants && exam.participants.length >= exam.maxParticipants) {
      res.status(400).json({
        success: false,
        message: "Kỳ thi đã đủ số lượng đăng ký.",
      });
      return;
    }

    // Kiểm tra trạng thái
    if (exam.status === "completed" || exam.status === "cancelled") {
      res.status(400).json({
        success: false,
        message: "Kỳ thi đã kết thúc hoặc bị hủy.",
      });
      return;
    }

    // Thêm sinh viên vào danh sách
    exam.participants.push(studentId!);
    await exam.save();

    res.status(200).json({
      success: true,
      message: "Đăng ký kỳ thi thành công!",
    });
  } catch (error) {
    console.error("Register exam error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng ký kỳ thi.",
    });
  }
};

// @desc    Unregister from public exam (hủy đăng ký)
// @route   DELETE /api/exams/:id/register
// @access  Private (Student)
export const unregisterExam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const examId = req.params.id;
    const studentId = req.user?._id;

    const exam = await Exam.findById(examId);

    if (!exam) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy kỳ thi.",
      });
      return;
    }

    // Kiểm tra đã đăng ký chưa
    const index = exam.participants.findIndex(
      (p) => p.toString() === studentId?.toString()
    );

    if (index === -1) {
      res.status(400).json({
        success: false,
        message: "Bạn chưa đăng ký kỳ thi này.",
      });
      return;
    }

    // Xóa khỏi danh sách
    exam.participants.splice(index, 1);
    await exam.save();

    res.status(200).json({
      success: true,
      message: "Hủy đăng ký thành công!",
    });
  } catch (error) {
    console.error("Unregister exam error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi hủy đăng ký.",
    });
  }
};

// @desc    Get participants of an exam (danh sách đăng ký)
// @route   GET /api/exams/:id/participants
// @access  Private (Admin)
export const getExamParticipants = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const exam = await Exam.findById(req.params.id)
      .populate("participants", "name email studentId phone");

    if (!exam) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy kỳ thi.",
      });
      return;
    }

    // Lấy điểm của các thí sinh
    const scores = await Score.find({ exam: req.params.id });
    const scoreMap: Record<string, any> = {};
    scores.forEach((s: any) => {
      scoreMap[s.student.toString()] = {
        score: s.score,
        note: s.note,
      };
    });

    const participantsWithScores = (exam.participants || []).map((p: any) => ({
      _id: p._id,
      name: p.name,
      email: p.email,
      studentId: p.studentId,
      phone: p.phone,
      score: scoreMap[p._id.toString()]?.score ?? null,
      note: scoreMap[p._id.toString()]?.note ?? "",
    }));

    res.status(200).json({
      success: true,
      data: {
        exam: {
          _id: exam._id,
          code: exam.code,
          name: exam.name,
          examDate: exam.examDate,
          startTime: exam.startTime,
          endTime: exam.endTime,
          room: exam.room,
        },
        participants: participantsWithScores,
      },
    });
  } catch (error) {
    console.error("Get exam participants error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};
