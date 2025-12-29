import { Router } from "express";
import {
  getScoresByExam,
  getScoresByStudent,
  getMyScores,
  getMyExamsAndScores,
  createScore,
  deleteScore,
  importScores,
  getStudentsForExam,
  getMyScoreHistory,
} from "../controllers/scoreController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(protect);

// Student routes
router.get("/my-scores", authorize("student"), getMyScores);
router.get("/my-exams", authorize("student"), getMyExamsAndScores);

// Teacher routes
router.get("/my-history", authorize("teacher"), getMyScoreHistory);

// Teacher & Admin routes
router.get("/exam/:examId", authorize("admin", "teacher"), getScoresByExam);
router.get("/exam/:examId/students", authorize("admin", "teacher"), getStudentsForExam);
router.get("/student/:studentId", authorize("admin", "teacher"), getScoresByStudent);
router.post("/", authorize("admin", "teacher"), createScore);
router.post("/import", authorize("admin", "teacher"), importScores);

// Admin only
router.delete("/:id", authorize("admin"), deleteScore);

export default router;

