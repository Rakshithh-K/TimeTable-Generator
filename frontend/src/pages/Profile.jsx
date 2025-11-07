import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, token } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "student" && token) {
      fetchStudentProfile();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  const fetchStudentProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/students/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudentData(data);
      }
    } catch (error) {
      console.error("Error fetching student profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-700 text-lg">Please log in to view your profile.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-700 text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-md p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-blue-600 text-sm font-medium">{user.role}</p>
            </div>
          </div>
          
          {user.role === "student" && (
            <>
              <hr className="my-6" />
              {studentData ? (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-800">Student Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Semester</label>
                      <p className="text-gray-800">{studentData.year}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Stream/Branch</label>
                      <p className="text-gray-800">{studentData.major_subject || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Section</label>
                      <p className="text-gray-800">{studentData.minor_subject || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Program</label>
                      <p className="text-gray-800">{studentData.program}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {studentData.projects && studentData.projects.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">Projects ({studentData.projects.length})</h5>
                        <div className="space-y-2">
                          {studentData.projects.map((project, index) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-md">
                              <h6 className="font-medium text-blue-900">{project.name}</h6>
                              <p className="text-blue-700 text-sm">{project.description}</p>
                              <p className="text-blue-600 text-xs"><strong>Tech:</strong> {project.technologies}</p>
                              {project.githubLink && (
                                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs underline">
                                  GitHub Link
                                </a>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Major Courses ({studentData.major_courses?.length || 0})</h5>
                      <div className="flex flex-wrap gap-2">
                        {studentData.major_courses?.map(course => (
                          <span key={course._id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {course.code} - {course.title}
                          </span>
                        )) || <span className="text-gray-500">No courses selected</span>}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Minor Courses ({studentData.minor_courses?.length || 0})</h5>
                      <div className="flex flex-wrap gap-2">
                        {studentData.minor_courses?.map(course => (
                          <span key={course._id} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                            {course.code} - {course.title}
                          </span>
                        )) || <span className="text-gray-500">No courses selected</span>}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-800 mb-2">Optional Courses ({studentData.optional_courses?.length || 0})</h5>
                      <div className="flex flex-wrap gap-2">
                        {studentData.optional_courses?.map(course => (
                          <span key={course._id} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                            {course.code} - {course.title}
                          </span>
                        )) || <span className="text-gray-500">No courses selected</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Student profile not found. Please complete your registration.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
