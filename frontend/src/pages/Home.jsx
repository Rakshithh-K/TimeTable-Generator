import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

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
      </div>
    </div>
  );
}
