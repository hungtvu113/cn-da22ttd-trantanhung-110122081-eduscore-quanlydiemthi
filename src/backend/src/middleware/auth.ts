import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { User, IUser } from "../models";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  id: string;
  role: string;
}

// Protect routes - require authentication
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Get token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Không có quyền truy cập. Vui lòng đăng nhập.",
      });
      return;
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default-secret"
    ) as JwtPayload;

    // Get user from token
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Người dùng không tồn tại.",
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: "Tài khoản đã bị vô hiệu hóa.",
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token không hợp lệ.",
    });
  }
};

// Authorize by role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Không có quyền truy cập.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Vai trò ${req.user.role} không có quyền truy cập.`,
      });
      return;
    }

    next();
  };
};

// Generate JWT token
export const generateToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || "default-secret";
  const options: SignOptions = {
    expiresIn: 604800, // 7 days in seconds
  };

  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    secret,
    options
  );
};

