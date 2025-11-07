import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User data:", user); // Debug log
    if (user && user.role === "student") {
      navigate("/student/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl bg-white w-full rounded-md shadow p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {user ? `Welcome, ${user.name}` : "Welcome"}
        </h1>
        <p className="text-gray-600">
          {user
            ? "Glad to have you back on the platform!"
            : "Login or sign up to start exploring."}
        </p>
        
        {user?.role === "student" && (
          <div className="mt-4">
            <button
              onClick={() => navigate("/student/dashboard")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Go to Student Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
