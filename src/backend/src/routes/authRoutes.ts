import { Router } from "express";
import { login, register, getMe, changePassword, updateProfile } from "../controllers/authController";
import { protect } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);
router.put("/update-profile", protect, updateProfile);

export default router;

