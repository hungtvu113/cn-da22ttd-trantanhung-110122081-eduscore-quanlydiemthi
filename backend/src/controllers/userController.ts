import { Request, Response } from "express";
import { User } from "../models";

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, search, isActive } = req.query;

    // Build query
    const query: Record<string, unknown> = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách người dùng.",
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private (Admin)
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name, role, studentId, phone } = req.body;

    const user = await User.create({
      email,
      password,
      name,
      role,
      studentId,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "Tạo người dùng thành công!",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        studentId: user.studentId,
        phone: user.phone,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo người dùng.",
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin)
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, name, role, studentId, phone, isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { email, name, role, studentId, phone, isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật người dùng thành công!",
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật người dùng.",
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Xóa người dùng thành công!",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa người dùng.",
    });
  }
};

