import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOTP from "./pages/VerifyOTP";
import Profile from "./pages/Profile";
import TimetablePage from "./pages/TimetablePage.jsx";
import AdminBatchPage from "./pages/AdminBatchPage.jsx";
import AdminFacultyVerify from "./pages/AdminFacultyVerify.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/batches" element={<AdminBatchPage />} />
        <Route path="/admin/verify-faculty" element={<AdminFacultyVerify />} />
      </Routes>
    </>
  );
}
