import express from "express";
import {
  sendOTP,
  verifyOTP,
  login,
  approveFaculty,
  getPendingFaculties,
  getMe,
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Public routes
router.post("/signup", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

// ✅ Protected routes
router.get("/me", protect, getMe);

// ✅ Admin routes
router.get("/pending-faculties", protect, adminOnly, getPendingFaculties);
router.post("/approve-faculty/:facultyId", protect, adminOnly, approveFaculty);

export default router;
