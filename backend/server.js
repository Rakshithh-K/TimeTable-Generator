import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import facultyRoutes from "./routes/facultyRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import devRoutes from "./routes/devRoutes.js";
import batchRoutes from "./routes/batchRoutes.js";

// Database connection
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("✅ AI Timetable Backend API is running...");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admin", uploadRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/dev", devRoutes);
app.use("/api/batches", batchRoutes);

// Global error handler (for safety)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
