import express from "express";
import multer from "multer";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadCSV } from "../controllers/uploadController.js";

const router = express.Router();

// Configure multer (store temporary files in /tmp)
const upload = multer({ dest: "tmp/" });

router.post("/upload", protect, adminOnly, upload.single("file"), uploadCSV);

export default router;
