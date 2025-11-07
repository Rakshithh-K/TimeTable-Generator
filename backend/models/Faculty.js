import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ no longer required
  department: { type: String, required: true },
  expertise: [{ type: String }],
  max_weekly_hours: { type: Number, default: 20 },
  availability: { type: Object, default: {} },
  created_at: { type: Date, default: Date.now },
});


export default mongoose.model("Faculty", facultySchema);
