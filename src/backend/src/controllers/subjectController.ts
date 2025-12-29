import { Request, Response } from "express";
import { Subject } from "../models";

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Private
export const getSubjects = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { search, isActive } = req.query;

    // Build query
    const query: Record<string, unknown> = {};

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true";
    }

    const subjects = await Subject.find(query).sort({ code: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects,
    });
  } catch (error) {
    console.error("Get subjects error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách môn thi.",
    });
  }
};

// @desc    Get single subject
// @route   GET /api/subjects/:id
// @access  Private
export const getSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy môn thi.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("Get subject error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private (Admin)
export const createSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, name, description, credits } = req.body;

    const subject = await Subject.create({
      code,
      name,
      description,
      credits,
    });

    res.status(201).json({
      success: true,
      message: "Tạo môn thi thành công!",
      data: subject,
    });
  } catch (error) {
    console.error("Create subject error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo môn thi.",
    });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin)
export const updateSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code, name, description, credits, isActive } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { code, name, description, credits, isActive },
      { new: true, runValidators: true }
    );

    if (!subject) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy môn thi.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật môn thi thành công!",
      data: subject,
    });
  } catch (error) {
    console.error("Update subject error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật môn thi.",
    });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
export const deleteSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy môn thi.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Xóa môn thi thành công!",
    });
  } catch (error) {
    console.error("Delete subject error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa môn thi.",
    });
  }
};

