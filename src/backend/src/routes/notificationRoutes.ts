import express from "express";
import {
  getNotifications,
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController";
import { protect, authorize } from "../middleware/auth";

const router = express.Router();

// Public route - lấy thông báo chung
router.get("/", getNotifications);

// Protected routes - cần đăng nhập
router.get("/my", protect, getMyNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/:id/read", protect, markAsRead);
router.put("/read-all", protect, markAllAsRead);

// Admin only - xóa thông báo
router.delete("/:id", protect, authorize("admin"), deleteNotification);

export default router;
