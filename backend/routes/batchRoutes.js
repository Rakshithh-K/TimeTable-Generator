import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createBatch,
  getBatches,
  addCourseToBatch,
  getCoursesByBatch,
  assignFaculty,
} from "../controllers/batchController.js";

const router = express.Router();

router.route("/")
  .get(protect, adminOnly, getBatches)
  .post(protect, adminOnly, createBatch);

router.route("/:batchId/courses")
  .get(protect, adminOnly, getCoursesByBatch)
  .post(protect, adminOnly, addCourseToBatch);

router.route("/course/:courseId/assign")
  .post(protect, adminOnly, assignFaculty);

export default router;
