import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  createFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
} from "../controllers/facultyController.js";

const router = express.Router();

router.route("/")
  .get(protect, getFaculty)
  .post(protect, adminOnly, createFaculty);

router.route("/:id")
  .put(protect, adminOnly, updateFaculty)
  .delete(protect, adminOnly, deleteFaculty);

export default router;
