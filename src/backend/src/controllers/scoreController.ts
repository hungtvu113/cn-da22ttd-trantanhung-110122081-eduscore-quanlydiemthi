import { Request, Response } from "express";
import { Score, Exam, Class } from "../models";

// @desc    Get exams and scores for logged in student (based on joined classes)
// @route   GET /api/scores/my-exams
// @access  Private (Student)
export const getMyExamsAndScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const studentId = req.user?._id;
    console.log("Student ID:", studentId);

    // 1. Lấy tất cả lớp mà sinh viên đã tham gia
    const classes = await Class.find({ students: studentId })
      .populate({
        path: "exams",
        populate: { path: "subject", select: "code name" },
      })
      .populate("subject", "code name")
      .populate("teacher", "name email");

    console.log("Classes found:", classes.length);
    console.log("Classes data:", JSON.stringify(classes.map((c: any) => ({
      id: c._id,
      name: c.name,
      examsCount: c.exams?.length || 0,
      exams: c.exams?.map((e: any) => e?.name || e)
    })), null, 2));

    // 2. Lấy tất cả kỳ thi từ các lớp
    const examIds: string[] = [];

    classes.forEach((cls: any) => {
      if (cls.exams && Array.isArray(cls.exams)) {
        cls.exams.forEach((exam: any) => {
          if (exam && exam._id) {
            const examId = exam._id.toString();
            if (!examIds.includes(examId)) {
              examIds.push(examId);
            }
          }
        });
      }
    });

    console.log("Exam IDs:", examIds);

    // 3. Lấy điểm của sinh viên cho các kỳ thi này
    const scores = await Score.find({
      student: studentId,
      exam: { $in: examIds },
    });

    const scoreMap: Record<string, any> = {};
    scores.forEach((score: any) => {
      scoreMap[score.exam.toString()] = {
        score: score.score,
        grade: score.grade,
        status: score.status,
        note: score.note,
        enteredAt: score.enteredAt,
      };
    });

    // 4. Kết hợp dữ liệu
    const result: any[] = [];
    classes.forEach((cls: any) => {
      if (cls.exams && Array.isArray(cls.exams)) {
        cls.exams.forEach((exam: any) => {
          if (exam && exam._id) {
            const examId = exam._id.toString();
            const scoreData = scoreMap[examId];

            result.push({
              examId: exam._id,
              examName: exam.name,
              examDate: exam.examDate,
              startTime: exam.startTime || "08:00",
              endTime: exam.endTime || "10:00",
              room: exam.room || "",
              status: exam.status,
              subject: exam.subject,
              class: {
                id: cls._id,
                code: cls.code,
                name: cls.name,
              },
              teacher: cls.teacher,
              score: scoreData?.score ?? null,
              grade: scoreData?.grade ?? null,
              scoreStatus: scoreData?.status ?? "pending",
              note: scoreData?.note ?? "",
            });
          }
        });
      }
    });

    // Sắp xếp theo ngày thi mới nhất
    result.sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime());

    console.log("Result count:", result.length);

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Get my exams and scores error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách kỳ thi và điểm.",
    });
  }
};

// @desc    Get scores for an exam
// @route   GET /api/scores/exam/:examId
// @access  Private
export const getScoresByExam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const scores = await Score.find({ exam: req.params.examId })
      .populate("student", "name email studentId")
      .populate("enteredBy", "name email")
      .populate("exam", "name examDate")
      .sort({ "student.studentId": 1 });

    res.status(200).json({
      success: true,
      count: scores.length,
      data: scores,
    });
  } catch (error) {
    console.error("Get scores error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách điểm.",
    });
  }
};

// @desc    Get scores for a student
// @route   GET /api/scores/student/:studentId
// @access  Private
export const getScoresByStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const scores = await Score.find({ student: req.params.studentId })
      .populate({
        path: "exam",
        populate: { path: "subject", select: "code name" },
      })
      .populate("enteredBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: scores.length,
      data: scores,
    });
  } catch (error) {
    console.error("Get student scores error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy điểm học viên.",
    });
  }
};

// @desc    Get my scores (for logged in student)
// @route   GET /api/scores/my-scores
// @access  Private (Student)
export const getMyScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const scores = await Score.find({ student: req.user?._id })
      .populate({
        path: "exam",
        populate: { path: "subject", select: "code name" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: scores.length,
      data: scores,
    });
  } catch (error) {
    console.error("Get my scores error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy điểm.",
    });
  }
};

// @desc    Create or update score
// @route   POST /api/scores
// @access  Private (Teacher, Admin)
export const createScore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { student, exam, score, note } = req.body;

    // Check if score already exists
    let existingScore = await Score.findOne({ student, exam });

    if (existingScore) {
      // Update existing score
      existingScore.score = score;
      existingScore.note = note;
      if (req.user?._id) {
        existingScore.enteredBy = req.user._id;
      }
      existingScore.enteredAt = new Date();
      await existingScore.save();

      const populatedScore = await Score.findById(existingScore._id)
        .populate("student", "name email studentId")
        .populate("exam", "name");

      res.status(200).json({
        success: true,
        message: "Cập nhật điểm thành công!",
        data: populatedScore,
      });
    } else {
      // Create new score
      const newScore = await Score.create({
        student,
        exam,
        score,
        note,
        enteredBy: req.user?._id,
      });

      const populatedScore = await Score.findById(newScore._id)
        .populate("student", "name email studentId")
        .populate("exam", "name");

      res.status(201).json({
        success: true,
        message: "Nhập điểm thành công!",
        data: populatedScore,
      });
    }
  } catch (error) {
    console.error("Create score error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi nhập điểm.",
    });
  }
};

// @desc    Delete score
// @route   DELETE /api/scores/:id
// @access  Private (Admin)
export const deleteScore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const score = await Score.findByIdAndDelete(req.params.id);

    if (!score) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy điểm.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Xóa điểm thành công!",
    });
  } catch (error) {
    console.error("Delete score error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa điểm.",
    });
  }
};

// @desc    Import scores from array (bulk import)
// @route   POST /api/scores/import
// @access  Private (Teacher, Admin)
export const importScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { examId, scores } = req.body;
    // scores: [{ studentId: string, score: number, note?: string }]

    if (!examId || !scores || !Array.isArray(scores)) {
      res.status(400).json({
        success: false,
        message: "Thiếu thông tin examId hoặc scores.",
      });
      return;
    }

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const item of scores) {
      try {
        if (!item.studentId || item.score === undefined || item.score === null) {
          results.failed++;
          results.errors.push(`Thiếu thông tin cho sinh viên ${item.studentId || "unknown"}`);
          continue;
        }

        // Validate score
        const scoreValue = parseFloat(item.score);
        if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 10) {
          results.failed++;
          results.errors.push(`Điểm không hợp lệ cho sinh viên ${item.studentId}`);
          continue;
        }

        // Check if score exists
        let existingScore = await Score.findOne({ 
          student: item.studentId, 
          exam: examId 
        });

        if (existingScore) {
          // Update
          existingScore.score = scoreValue;
          existingScore.note = item.note || existingScore.note;
          if (req.user?._id) {
            existingScore.enteredBy = req.user._id;
          }
          existingScore.enteredAt = new Date();
          await existingScore.save();
        } else {
          // Create new
          await Score.create({
            student: item.studentId,
            exam: examId,
            score: scoreValue,
            note: item.note || "",
            enteredBy: req.user?._id,
          });
        }
        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push(`Lỗi khi xử lý sinh viên ${item.studentId}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Import hoàn tất: ${results.success} thành công, ${results.failed} thất bại.`,
      data: results,
    });
  } catch (error) {
    console.error("Import scores error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi import điểm.",
    });
  }
};

// @desc    Get students for an exam (from class)
// @route   GET /api/scores/exam/:examId/students
// @access  Private (Teacher, Admin)
export const getStudentsForExam = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const examId = req.params.examId;

    // Tìm lớp có kỳ thi này
    const classWithExam = await Class.findOne({ exams: examId })
      .populate("students", "name email studentId")
      .populate({
        path: "exams",
        match: { _id: examId },
        select: "name examDate startTime endTime room",
      });

    if (!classWithExam) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học có kỳ thi này.",
      });
      return;
    }

    // Lấy điểm đã có của sinh viên trong kỳ thi này
    const existingScores = await Score.find({ exam: examId });
    const scoreMap: Record<string, any> = {};
    existingScores.forEach((s: any) => {
      scoreMap[s.student.toString()] = {
        score: s.score,
        note: s.note,
        enteredAt: s.enteredAt,
      };
    });

    // Map students với điểm
    const studentsWithScores = (classWithExam.students || []).map((student: any) => {
      const scoreData = scoreMap[student._id.toString()];
      return {
        _id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        score: scoreData?.score ?? null,
        note: scoreData?.note ?? "",
        enteredAt: scoreData?.enteredAt ?? null,
        status: scoreData?.score !== undefined ? "entered" : "pending",
      };
    });

    res.status(200).json({
      success: true,
      data: {
        class: {
          _id: classWithExam._id,
          code: classWithExam.code,
          name: classWithExam.name,
        },
        exam: classWithExam.exams?.[0] || null,
        students: studentsWithScores,
      },
    });
  } catch (error) {
    console.error("Get students for exam error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách sinh viên.",
    });
  }
};


// @desc    Get score history entered by teacher
// @route   GET /api/scores/my-history
// @access  Private (Teacher)
export const getMyScoreHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const teacherId = req.user?._id;

    // Lấy tất cả điểm do giáo viên này nhập
    const scores = await Score.find({ enteredBy: teacherId })
      .populate("student", "name email studentId")
      .populate({
        path: "exam",
        populate: { path: "subject", select: "code name" },
      })
      .sort({ enteredAt: -1, createdAt: -1 });

    // Map dữ liệu
    const history = scores.map((score: any) => ({
      _id: score._id,
      examId: score.exam?._id,
      examName: score.exam?.name || "",
      examCode: score.exam?.code || "",
      examDate: score.exam?.examDate,
      subjectName: score.exam?.subject?.name || "",
      studentId: score.student?.studentId || "",
      studentName: score.student?.name || "",
      studentEmail: score.student?.email || "",
      score: score.score,
      note: score.note || "",
      enteredAt: score.enteredAt || score.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Get score history error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy lịch sử nhập điểm.",
    });
  }
};

// @desc    Cleanup orphan scores (scores without valid exam)
// @route   DELETE /api/scores/cleanup-orphans
// @access  Private (Admin)
export const cleanupOrphanScores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Lấy tất cả exam IDs hiện có
    const exams = await Exam.find().select("_id");
    const validExamIds = exams.map((e) => e._id);

    // Xóa tất cả scores không có exam hợp lệ
    const result = await Score.deleteMany({
      $or: [
        { exam: { $nin: validExamIds } },
        { exam: null },
        { exam: { $exists: false } },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Đã xóa ${result.deletedCount} điểm orphan.`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error("Cleanup orphan scores error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa điểm orphan.",
    });
  }
};
