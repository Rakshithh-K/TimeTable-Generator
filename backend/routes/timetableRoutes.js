import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  generateNaiveTimetable,
  getLatestTimetable,
} from "../controllers/timetableController.js";

const router = express.Router();

router.post("/generate", protect, adminOnly, generateNaiveTimetable);
router.get("/latest", protect, getLatestTimetable);

export default router;
