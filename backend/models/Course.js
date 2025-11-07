import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true }, // ✅ new
  code: { type: String, required: true },
  title: { type: String, required: true },
  credits: { type: Number, required: true },
  total_hours: { type: Number, required: true },
  assigned_faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Course", courseSchema);
