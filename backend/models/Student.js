import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  program: { type: String, required: true },
  year: { type: Number, required: true },
  major: { type: String },
  minor: { type: String },
  enrolled_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Student", studentSchema);
