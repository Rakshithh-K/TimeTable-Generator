import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false }, // ✅ verified email
    role: {
      type: String,
      enum: ["admin", "faculty", "student"],
      default: "student",
    },
    facultyId: { type: String }, // ✅ for faculty only
    usn: { type: String }, // ✅ for student only
    isApproved: { type: Boolean, default: false }, // ✅ admin approval for faculty
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
