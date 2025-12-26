import { Router } from "express";
import {
  getExams,
  getExam,
  createExam,
  updateExam,
  deleteExam,
} from "../controllers/examController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(protect);

// Public routes (all authenticated users can view)
router.get("/", getExams);
router.get("/:id", getExam);

// Admin only routes
router.post("/", authorize("admin"), createExam);
router.put("/:id", authorize("admin"), updateExam);
router.delete("/:id", authorize("admin"), deleteExam);

export default router;

