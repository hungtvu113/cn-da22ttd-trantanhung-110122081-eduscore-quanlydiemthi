import { Request, Response } from "express";
import { User } from "../models";
import { generateToken } from "../middleware/auth";

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và mật khẩu.",
      });
      return;
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng.",
      });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng.",
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Tài khoản đã bị vô hiệu hóa.",
      });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công!",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          studentId: user.studentId,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập.",
    });
  }
};

// @desc    Register student
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, name, password, phone } = req.body;

    // Validate input
    if (!studentId || !name || !password) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin: mã sinh viên, họ tên, mật khẩu.",
      });
      return;
    }

    // Validate studentId format (9 digits)
    if (!/^\d{9}$/.test(studentId)) {
      res.status(400).json({
        success: false,
        message: "Mã sinh viên phải là 9 chữ số.",
      });
      return;
    }

    // Validate password length
    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
      });
      return;
    }

    // Generate email from studentId
    const email = `${studentId}@gmail.com`;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { studentId }]
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Mã sinh viên này đã được đăng ký.",
      });
      return;
    }

    // Create user (only students can register)
    const user = await User.create({
      email,
      password,
      name,
      role: "student", // Always student for registration
      studentId,
      phone: phone || "",
      isActive: true,
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công!",
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          studentId: user.studentId,
        },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng ký.",
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        studentId: user.studentId,
        phone: user.phone,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.",
      });
      return;
    }

    const user = await User.findById(req.user?._id).select("+password");

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
      return;
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Mật khẩu hiện tại không đúng.",
      });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};


// @desc    Update profile
// @route   PUT /api/auth/update-profile
// @access  Private
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng.",
      });
      return;
    }

    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công!",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật thông tin.",
    });
  }
};
