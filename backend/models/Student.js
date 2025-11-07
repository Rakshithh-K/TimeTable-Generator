import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  program: { type: String, required: true },
  year: { type: Number, required: true },
  major_subject: { type: String },
  minor_subject: { type: String },
  major_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  minor_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  optional_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  projects: [{
    name: String,
    description: String,
    technologies: String,
    githubLink: String,
    created_at: { type: Date, default: Date.now }
  }],
  internships: [{
    role: String,
    company: String,
    created_at: { type: Date, default: Date.now }
  }],
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("Student", studentSchema);
