import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createCourse,
  getCourses,
  getCoursesByCategory,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.route("/")
  .get(protect, getCourses)
  .post(protect, adminOnly, createCourse);

router.get("/by-category", protect, getCoursesByCategory);

router.route("/:id")
  .put(protect, adminOnly, updateCourse)
  .delete(protect, adminOnly, deleteCourse);

export default router;
