import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

router.route("/")
  .get(protect, getStudents)
  .post(protect, adminOnly, createStudent);

router.route("/:id")
  .put(protect, adminOnly, updateStudent)
  .delete(protect, adminOnly, deleteStudent);

export default router;
