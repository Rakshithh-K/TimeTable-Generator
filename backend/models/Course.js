import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  code: { type: String, required: true },
  title: { type: String, required: true },
  credits: { type: Number, required: true },
  category: { type: String, enum: ["major", "minor", "optional"], required: true },
  total_hours: { type: Number, required: true },
  assigned_faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Course", courseSchema);
