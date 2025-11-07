import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function StudentRegistration({ studentData, onRegistrationComplete }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    semester: "",
    major_subject: "",
    minor_subject: "",
    major_courses: [],
    minor_courses: [],
    optional_courses: []
  });
  const [coursesByCategory, setCoursesByCategory] = useState({
    major: [],
    minor: [],
    optional: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchCoursesByCategory();
    if (studentData) {
      setFormData({
        semester: studentData.year || "",
        major_subject: studentData.major_subject || "",
        minor_subject: studentData.minor_subject || "",
        major_courses: studentData.major_courses?.map(c => c._id) || [],
        minor_courses: studentData.minor_courses?.map(c => c._id) || [],
        optional_courses: studentData.optional_courses?.map(c => c._id) || []
      });
    }
  }, [studentData]);



  const fetchCoursesByCategory = async () => {
    try {
      console.log("Fetching courses from:", `${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/courses/by-category`);
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/courses/by-category`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("Response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched courses:", data);
        console.log("Major courses count:", data.major?.length || 0);
        console.log("Minor courses count:", data.minor?.length || 0);
        console.log("Optional courses count:", data.optional?.length || 0);
        setCoursesByCategory(data || { major: [], minor: [], optional: [] });
      } else {
        const errorText = await response.text();
        console.error("Failed to fetch courses:", response.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCourse = (courseId, category) => {
    setFormData(prev => ({
      ...prev,
      [category]: [...prev[category], courseId]
    }));
  };

  const removeCourse = (courseId, category) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].filter(id => id !== courseId)
    }));
  };

  const getSelectedCourses = (category) => {
    const categoryKey = category === 'major_courses' ? 'major' : 
                       category === 'minor_courses' ? 'minor' : 'optional';
    return coursesByCategory[categoryKey].filter(course => 
      formData[category].includes(course._id)
    );
  };

  const getAvailableCourses = (category) => {
    const categoryKey = category === 'major_courses' ? 'major' : 
                       category === 'minor_courses' ? 'minor' : 'optional';
    return coursesByCategory[categoryKey].filter(course => 
      !formData[category].includes(course._id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.major_courses.length < 2) {
      setMessage("Please select at least 2 major courses");
      setLoading(false);
      return;
    }
    if (formData.minor_courses.length < 2) {
      setMessage("Please select at least 2 minor courses");
      setLoading(false);
      return;
    }
    if (formData.optional_courses.length < 2) {
      setMessage("Please select at least 2 optional courses");
      setLoading(false);
      return;
    }

    try {
      const endpoint = studentData 
        ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/students/profile`
        : `${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/students/register`;
      
      const method = studentData ? "PUT" : "POST";
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          program: "Undergraduate",
          year: parseInt(formData.semester),
          major_subject: formData.major_subject,
          minor_subject: formData.minor_subject,
          major_courses: formData.major_courses,
          minor_courses: formData.minor_courses,
          optional_courses: formData.optional_courses
        })
      });

      if (response.ok) {
        setMessage(studentData ? "Profile updated successfully!" : "Registration successful!");
        onRegistrationComplete();
      } else {
        const error = await response.json();
        setMessage(error.message || "An error occurred");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {studentData ? "Update Student Profile" : "Student Registration"}
      </h2>
      
      {message && (
        <div className={`mb-4 p-4 rounded-md ${
          message.includes("successful") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Semester
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stream/Branch
            </label>
            <select
              name="major_subject"
              value={formData.major_subject}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Stream/Branch</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
              <option value="Electrical">Electrical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section
            </label>
            <select
              name="minor_subject"
              value={formData.minor_subject}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Section</option>
              <option value="Section A">Section A</option>
              <option value="Section B">Section B</option>
              <option value="Section C">Section C</option>
              <option value="Section D">Section D</option>
            </select>
          </div>
        </div>

        <div className="space-y-8">
          {/* Major Courses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Major Courses (4 Credits) - Minimum 2 required
              </h3>
              <span className="text-sm text-gray-500">
                Selected: {formData.major_courses.length}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {getAvailableCourses('major_courses').length > 0 ? (
                  getAvailableCourses('major_courses').map(course => (
                    <button
                      key={course._id}
                      type="button"
                      onClick={() => addCourse(course._id, 'major_courses')}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      <span className="mr-1">+</span>
                      {course.code} - {course.title}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No major courses available. Please contact admin.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {getSelectedCourses('major_courses').map(course => (
                <div key={course._id} className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                  <span className="text-sm text-gray-700">
                    {course.code} - {course.title} ({course.credits} credits)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCourse(course._id, 'major_courses')}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Minor Courses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Minor Courses (2-3 Credits) - Minimum 2 required
              </h3>
              <span className="text-sm text-gray-500">
                Selected: {formData.minor_courses.length}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {getAvailableCourses('minor_courses').length > 0 ? (
                  getAvailableCourses('minor_courses').map(course => (
                    <button
                      key={course._id}
                      type="button"
                      onClick={() => addCourse(course._id, 'minor_courses')}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 hover:bg-purple-200"
                    >
                      <span className="mr-1">+</span>
                      {course.code} - {course.title}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No minor courses available. Please contact admin.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {getSelectedCourses('minor_courses').map(course => (
                <div key={course._id} className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                  <span className="text-sm text-gray-700">
                    {course.code} - {course.title} ({course.credits} credits)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCourse(course._id, 'minor_courses')}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Courses */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Optional Courses - Minimum 2 required
              </h3>
              <span className="text-sm text-gray-500">
                Selected: {formData.optional_courses.length}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {getAvailableCourses('optional_courses').length > 0 ? (
                  getAvailableCourses('optional_courses').map(course => (
                    <button
                      key={course._id}
                      type="button"
                      onClick={() => addCourse(course._id, 'optional_courses')}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800 hover:bg-orange-200"
                    >
                      <span className="mr-1">+</span>
                      {course.code} - {course.title}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No optional courses available. Please contact admin.</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              {getSelectedCourses('optional_courses').map(course => (
                <div key={course._id} className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                  <span className="text-sm text-gray-700">
                    {course.code} - {course.title} ({course.credits} credits)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCourse(course._id, 'optional_courses')}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : (studentData ? "Update Profile" : "Register")}
          </button>
        </div>
      </form>
    </div>
  );
}