import mongoose from "mongoose";

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Batch", batchSchema);
