import { Request, Response } from "express";
import { Class } from "../models";

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
export const getClasses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, teacher, semester, academicYear, search } = req.query;

    const query: Record<string, unknown> = {};

    if (subject) query.subject = subject;
    if (teacher) query.teacher = teacher;
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    const classes = await Class.find(query)
      .populate("subject", "code name")
      .populate("teacher", "name email")
      .populate("students", "name email studentId")
      .populate("exams", "_id name examDate startTime endTime room status subject")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    console.error("Get classes error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách lớp học.",
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private
export const getClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate("subject", "code name")
      .populate("teacher", "name email")
      .populate("students", "name email studentId phone")
      .populate("exams", "name examDate duration status");

    if (!classData) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    console.error("Get class error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Create class
// @route   POST /api/classes
// @access  Private (Admin)
export const createClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, name, subject, teacher, semester, academicYear, schedule, room, maxStudents, password } = req.body;

    // Check if class code already exists
    const existingClass = await Class.findOne({ code: code.toUpperCase() });
    if (existingClass) {
      res.status(400).json({
        success: false,
        message: "Mã lớp đã tồn tại.",
      });
      return;
    }

    // Validate password
    if (!password || password.length < 4) {
      res.status(400).json({
        success: false,
        message: "Mật khẩu lớp phải có ít nhất 4 ký tự.",
      });
      return;
    }

    const newClass = await Class.create({
      code,
      name,
      subject,
      teacher,
      semester,
      academicYear,
      schedule,
      room,
      maxStudents: maxStudents || 50,
      password,
      students: [],
      exams: [],
    });

    const populatedClass = await Class.findById(newClass._id)
      .populate("subject", "code name")
      .populate("teacher", "name email");

    res.status(201).json({
      success: true,
      message: "Tạo lớp học thành công.",
      data: populatedClass,
    });
  } catch (error) {
    console.error("Create class error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo lớp học.",
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (Admin)
export const updateClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học.",
      });
      return;
    }

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("subject", "code name")
      .populate("teacher", "name email")
      .populate("students", "name email studentId");

    res.status(200).json({
      success: true,
      message: "Cập nhật lớp học thành công.",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Update class error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật lớp học.",
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (Admin)
export const deleteClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học.",
      });
      return;
    }

    await Class.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Xóa lớp học thành công.",
    });
  } catch (error) {
    console.error("Delete class error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa lớp học.",
    });
  }
};

// @desc    Add students to class
// @route   POST /api/classes/:id/students
// @access  Private (Admin)
export const addStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentIds } = req.body;
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học.",
      });
      return;
    }

    // Check if class is full
    const currentCount = classData.students.length;
    const newCount = studentIds.length;
    if (currentCount + newCount > classData.maxStudents) {
      res.status(400).json({
        success: false,
        message: `Lớp học đã đầy. Tối đa ${classData.maxStudents} sinh viên.`,
      });
      return;
    }

    // Add students (avoid duplicates)
    const existingIds = classData.students.map((id) => id.toString());
    const newStudentIds = studentIds.filter((id: string) => !existingIds.includes(id));

    classData.students.push(...newStudentIds);
    await classData.save();

    const updatedClass = await Class.findById(req.params.id)
      .populate("students", "name email studentId");

    res.status(200).json({
      success: true,
      message: `Đã thêm ${newStudentIds.length} sinh viên vào lớp.`,
      data: updatedClass,
    });
  } catch (error) {
    console.error("Add students error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm sinh viên.",
    });
  }
};

// @desc    Remove student from class
// @route   DELETE /api/classes/:id/students/:studentId
// @access  Private (Admin)
export const removeStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, studentId } = req.params;
    const classData = await Class.findById(id);

    if (!classData) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học.",
      });
      return;
    }

    classData.students = classData.students.filter(
      (sid) => sid.toString() !== studentId
    );
    await classData.save();

    res.status(200).json({
      success: true,
      message: "Đã xóa sinh viên khỏi lớp.",
    });
  } catch (error) {
    console.error("Remove student error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa sinh viên.",
    });
  }
};

// @desc    Add exam to class
// @route   POST /api/classes/:id/exams
// @access  Private (Admin)
export const addExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId } = req.body;
    const classData = await Class.findById(req.params.id);

    if (!classData) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học.",
      });
      return;
    }

    // Check if exam already added
    if (classData.exams.some((eid) => eid.toString() === examId)) {
      res.status(400).json({
        success: false,
        message: "Kỳ thi đã được thêm vào lớp.",
      });
      return;
    }

    classData.exams.push(examId);
    await classData.save();

    const updatedClass = await Class.findById(req.params.id)
      .populate("exams", "name examDate status");

    res.status(200).json({
      success: true,
      message: "Đã thêm kỳ thi vào lớp.",
      data: updatedClass,
    });
  } catch (error) {
    console.error("Add exam error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi thêm kỳ thi.",
    });
  }
};

// @desc    Get classes by teacher
// @route   GET /api/classes/teacher/:teacherId
// @access  Private
export const getClassesByTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await Class.find({ teacher: req.params.teacherId })
      .populate("subject", "code name")
      .populate("students", "name email studentId")
      .populate("exams", "_id name examDate startTime endTime room status subject")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    console.error("Get classes by teacher error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Get classes by student
// @route   GET /api/classes/student/:studentId
// @access  Private
export const getClassesByStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const classes = await Class.find({ students: req.params.studentId })
      .populate("subject", "code name")
      .populate("teacher", "name email")
      .populate("exams", "_id name examDate startTime endTime room status subject")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    console.error("Get classes by student error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Student join class with password
// @route   POST /api/classes/:id/join
// @access  Private (Student)
export const joinClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { password } = req.body;
    const classId = req.params.id;
    const studentId = (req as any).user._id;

    if (!password) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập mật khẩu lớp.",
      });
      return;
    }

    const classData = await Class.findById(classId);

    if (!classData) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học.",
      });
      return;
    }

    // Check password
    if (classData.password !== password) {
      res.status(401).json({
        success: false,
        message: "Mật khẩu không đúng.",
      });
      return;
    }

    // Check if already joined
    if (classData.students.some((s) => s.toString() === studentId.toString())) {
      res.status(400).json({
        success: false,
        message: "Bạn đã tham gia lớp này rồi.",
      });
      return;
    }

    // Check max students
    if (classData.students.length >= classData.maxStudents) {
      res.status(400).json({
        success: false,
        message: "Lớp đã đầy, không thể tham gia.",
      });
      return;
    }

    // Add student to class
    classData.students.push(studentId);
    await classData.save();

    res.status(200).json({
      success: true,
      message: "Tham gia lớp thành công!",
    });
  } catch (error) {
    console.error("Join class error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Student leave class
// @route   POST /api/classes/:id/leave
// @access  Private (Student)
export const leaveClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classId = req.params.id;
    const studentId = (req as any).user._id;

    const classData = await Class.findById(classId);

    if (!classData) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy lớp học.",
      });
      return;
    }

    // Check if student is in class
    const studentIndex = classData.students.findIndex(
      (s) => s.toString() === studentId.toString()
    );

    if (studentIndex === -1) {
      res.status(400).json({
        success: false,
        message: "Bạn không thuộc lớp này.",
      });
      return;
    }

    // Remove student from class
    classData.students.splice(studentIndex, 1);
    await classData.save();

    res.status(200).json({
      success: true,
      message: "Rời khỏi lớp thành công!",
    });
  } catch (error) {
    console.error("Leave class error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};
