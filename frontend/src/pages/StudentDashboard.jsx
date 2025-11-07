import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import StudentRegistration from "../components/StudentRegistration";
import ActivitySection from "../components/ActivitySection";

export default function StudentDashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState("timetable");
  const [studentData, setStudentData] = useState(null);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      checkStudentRegistration();
    }
  }, [user, token]);

  const checkStudentRegistration = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/students/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
        if (data) {
          fetchTimetable();
        }
      }
    } catch (error) {
      console.error("Error checking student registration:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimetable = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/timetable/student`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTimetable(data);
      }
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  const downloadTimetable = () => {
    const printContent = `
      <html>
        <head>
          <title>Timetable - ${user?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .student-info { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">NOVA - Timetable Management System</div>
            <h2>Student Timetable</h2>
          </div>
          <div class="student-info">
            <p><strong>Student Name:</strong> ${user?.name}</p>
            <p><strong>Email:</strong> ${user?.email}</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
              </tr>
            </thead>
            <tbody>
              ${timetable.map(slot => `
                <tr>
                  <td>${slot.time}</td>
                  <td>${slot.monday || '-'}</td>
                  <td>${slot.tuesday || '-'}</td>
                  <td>${slot.wednesday || '-'}</td>
                  <td>${slot.thursday || '-'}</td>
                  <td>${slot.friday || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("timetable")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "timetable"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                My Timetable
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "register"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {studentData ? "Update Profile" : "Register as Student"}
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "activity"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Activity
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "timetable" && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Timetable</h2>
                {!studentData ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Registration Found</h3>
                    <p className="text-gray-500 mb-4">Please register as a student to view your timetable.</p>
                    <button
                      onClick={() => setActiveTab("register")}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Register Now
                    </button>
                  </div>
                ) : timetable.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Hey {user?.name}!</h3>
                    <p className="text-gray-500 mb-4">The timetable is not yet generated. Once it's done, you can download it.</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Your Timetable</h3>
                      <button
                        onClick={downloadTimetable}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monday</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuesday</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wednesday</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thursday</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Friday</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {timetable.map((slot, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {slot.time}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.monday || "-"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.tuesday || "-"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.wednesday || "-"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.thursday || "-"}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.friday || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "register" && (
              <StudentRegistration 
                studentData={studentData} 
                onRegistrationComplete={checkStudentRegistration}
              />
            )}

            {activeTab === "activity" && (
              <ActivitySection studentData={studentData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}