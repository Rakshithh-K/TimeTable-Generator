import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createStudent,
  registerStudent,
  getStudentProfile,
  updateStudentProfile,
  addProject,
  addInternship,
  deleteProject,
  updateProject,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

// Student self-registration and profile routes
router.post("/register", protect, registerStudent);
router.route("/profile")
  .get(protect, getStudentProfile)
  .put(protect, updateStudentProfile);

// Activity routes
router.post("/add-project", protect, addProject);
router.post("/add-internship", protect, addInternship);
router.delete("/project/:projectId", protect, deleteProject);
router.put("/project/:projectId", protect, updateProject);

// Admin routes
router.route("/")
  .get(protect, getStudents)
  .post(protect, adminOnly, createStudent);

router.route("/:id")
  .put(protect, adminOnly, updateStudent)
  .delete(protect, adminOnly, deleteStudent);

export default router;
