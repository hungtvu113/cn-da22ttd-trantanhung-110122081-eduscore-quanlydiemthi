import { Request, Response } from "express";
import { Notification } from "../models";

// @desc    Get all notifications (public - chỉ lấy thông báo chung)
// @route   GET /api/notifications
// @access  Public
export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    // Chỉ lấy thông báo chung (targetUser = null)
    const notifications = await Notification.find({ targetUser: null })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông báo.",
    });
  }
};

// @desc    Get notifications for logged in user (thông báo chung + thông báo riêng)
// @route   GET /api/notifications/my
// @access  Private
export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    // Lấy thông báo chung (targetUser = null) + thông báo riêng cho user này
    const notifications = await Notification.find({
      $or: [
        { targetUser: null },
        { targetUser: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get my notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông báo.",
    });
  }
};

// @desc    Get unread count for user
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    const count = await Notification.countDocuments({
      $or: [
        { targetUser: null },
        { targetUser: userId }
      ],
      readBy: { $ne: userId }
    });

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    await Notification.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json({
      success: true,
      message: "Đã đánh dấu đã đọc.",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    // Chỉ đánh dấu thông báo chung + thông báo riêng của user
    await Notification.updateMany(
      {
        $or: [
          { targetUser: null },
          { targetUser: userId }
        ],
        readBy: { $ne: userId }
      },
      { $addToSet: { readBy: userId } }
    );

    res.status(200).json({
      success: true,
      message: "Đã đánh dấu tất cả đã đọc.",
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Delete notification (Admin only)
// @route   DELETE /api/notifications/:id
// @access  Private (Admin)
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    
    if (!notification) {
      res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa thông báo.",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
    });
  }
};

// @desc    Create notification (internal use)
// @access  Internal
export const createNotification = async (data: {
  title: string;
  message: string;
  type: "exam" | "score" | "class" | "system";
  relatedId?: string;
  relatedModel?: "Exam" | "Score" | "Class";
}) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error("Create notification error:", error);
    return null;
  }
};
