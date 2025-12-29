import { Router } from "express";
import {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  addStudents,
  removeStudent,
  addExam,
  getClassesByTeacher,
  getClassesByStudent,
  joinClass,
  leaveClass,
} from "../controllers/classController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(protect);

// Get classes by teacher/student (must be before /:id to avoid conflict)
router.get("/teacher/:teacherId", getClassesByTeacher);
router.get("/student/:studentId", getClassesByStudent);

// Public routes (all authenticated users can view)
router.get("/", getClasses);
router.get("/:id", getClass);

// Admin only routes
router.post("/", authorize("admin"), createClass);
router.put("/:id", authorize("admin"), updateClass);
router.delete("/:id", authorize("admin"), deleteClass);

// Manage students in class
router.post("/:id/students", authorize("admin"), addStudents);
router.delete("/:id/students/:studentId", authorize("admin"), removeStudent);

// Manage exams in class
router.post("/:id/exams", authorize("admin"), addExam);

// Student join/leave class
router.post("/:id/join", authorize("student"), joinClass);
router.post("/:id/leave", authorize("student"), leaveClass);

export default router;

