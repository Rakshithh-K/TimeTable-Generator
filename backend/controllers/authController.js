import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmailOTP, sendWelcomeEmail, sendFacultyApprovedEmail } from "../utils/otpUtils.js";

// 📩 Step 1: Signup with OTP
export const sendOTP = async (req, res) => {
  try {
    const { name, email, password, role, facultyId, usn } = req.body;

    if (!role) return res.status(400).json({ message: "Role is required" });
    if (role === "faculty" && !facultyId)
      return res.status(400).json({ message: "Faculty ID is required" });
    if (role === "student" && !usn)
      return res.status(400).json({ message: "USN is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 mins

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      role,
      facultyId,
      usn,
    });

    await sendEmailOTP(email, otp);
    res.status(200).json({ message: "OTP sent to email", userId: user._id });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// ✅ Step 2: Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: "OTP expired" });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Send welcome email (faculty/student)
    await sendWelcomeEmail(user);

    res.status(200).json({
      message:
        user.role === "faculty"
          ? "Email verified. Awaiting admin approval."
          : "Account verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// 🔐 Step 3: Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email first" });

    if (user.role === "faculty" && !user.isApproved)
      return res.status(403).json({ message: "Faculty not yet approved by admin" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

// ✅ Step 4: Admin Approves Faculty
export const approveFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const faculty = await User.findById(facultyId);

    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    if (faculty.role !== "faculty")
      return res.status(400).json({ message: "User is not a faculty" });

    faculty.isApproved = true;
    await faculty.save();

    await sendFacultyApprovedEmail(faculty);

    res.status(200).json({ message: "Faculty approved successfully" });
  } catch (error) {
    console.error("Approval error:", error);
    res.status(500).json({ message: "Approval failed" });
  }
};

// 🧾 Step 5: Get all pending faculties (for admin)
export const getPendingFaculties = async (req, res) => {
  try {
    const pending = await User.find({ role: "faculty", isApproved: false });
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending faculties" });
  }
};

// Get current user data
export const getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
