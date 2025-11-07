import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";
console.log("🔍 Email user:", process.env.EMAIL_USER);
console.log("🔍 Email pass:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
export const sendEmailOTP = async (email, otp) => {
  await transporter.sendMail({
    from: `"AI Timetable System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP",
    html: `<h2>OTP Verification</h2><p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};

// Send welcome email (based on role)
export const sendWelcomeEmail = async (user) => {
  const roleMsg =
    user.role === "faculty"
      ? "Thank you for registering as Faculty. Please wait for admin approval."
      : "Welcome to the AI Timetable System! Your account is ready.";

  await transporter.sendMail({
    from: `"AI Timetable System" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Welcome ${user.role === "faculty" ? "Faculty" : "Student"}`,
    html: `<h3>Hello ${user.name},</h3><p>${roleMsg}</p>`,
  });
};

// Send email after faculty is approved
export const sendFacultyApprovedEmail = async (faculty) => {
  await transporter.sendMail({
    from: `"AI Timetable System" <${process.env.EMAIL_USER}>`,
    to: faculty.email,
    subject: "Faculty Verification Approved",
    html: `<h3>Hello ${faculty.name},</h3><p>Your faculty account has been approved by admin. You can now log in.</p>`,
  });
};
