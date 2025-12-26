import { Router } from "express";
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// All routes require authentication
router.use(protect);

// Public routes (all authenticated users can view)
router.get("/", getSubjects);
router.get("/:id", getSubject);

// Admin only routes
router.post("/", authorize("admin"), createSubject);
router.put("/:id", authorize("admin"), updateSubject);
router.delete("/:id", authorize("admin"), deleteSubject);

export default router;

