import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  version_name: { type: String, default: "v1" },
  data: { type: Array, default: [] },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Timetable", timetableSchema);
