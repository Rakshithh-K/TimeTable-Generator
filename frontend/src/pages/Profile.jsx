import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-700 text-lg">Please log in to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-md p-8 w-full max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        </div>
        <hr className="my-4" />
        <div>
          <p className="text-gray-700 text-sm">Account created</p>
        </div>
      </div>
    </div>
  );
}
