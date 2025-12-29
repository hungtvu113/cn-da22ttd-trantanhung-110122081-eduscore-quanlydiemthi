import { Router } from "express";
import authRoutes from "./authRoutes";
import subjectRoutes from "./subjectRoutes";
import examRoutes from "./examRoutes";
import userRoutes from "./userRoutes";
import scoreRoutes from "./scoreRoutes";
import classRoutes from "./classRoutes";

const router = Router();

// Mount routes
router.use("/auth", authRoutes);
router.use("/subjects", subjectRoutes);
router.use("/exams", examRoutes);
router.use("/users", userRoutes);
router.use("/scores", scoreRoutes);
router.use("/classes", classRoutes);

export default router;

