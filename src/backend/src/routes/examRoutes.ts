import { Router } from "express";
import {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
  getPublicExams,
  registerExam,
  unregisterExam,
  getExamParticipants,
} from "../controllers/examController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// Public route - kỳ thi chung (không cần đăng nhập để xem)
router.get("/public", getPublicExams);

// All routes below require authentication
router.use(protect);

// Public routes (all authenticated users can view)
router.get("/", getExams);
router.get("/:id", getExam);

// Student routes - đăng ký kỳ thi chung
router.post("/:id/register", authorize("student"), registerExam);
router.delete("/:id/register", authorize("student"), unregisterExam);

// Admin only routes
router.get("/:id/participants", authorize("admin"), getExamParticipants);
router.post("/", authorize("admin"), createExam);
router.put("/:id", authorize("admin"), updateExam);
router.delete("/:id", authorize("admin"), deleteExam);

export default router;

