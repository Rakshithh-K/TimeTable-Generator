import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBatchPage() {
  const [batches, setBatches] = useState([]);
  const [newBatch, setNewBatch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ code: "", title: "", credits: "", total_hours: "" });
  const [faculty, setFaculty] = useState([]);
  const [assignData, setAssignData] = useState({ courseId: "", facultyId: "" });
  const token = localStorage.getItem("token");

  const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchBatches = async () => {
    const res = await API.get("/batches");
    setBatches(res.data);
  };

  const createBatch = async () => {
    if (!newBatch.trim()) return alert("Enter batch name");
    await API.post("/batches", { name: newBatch });
    setNewBatch("");
    fetchBatches();
  };

  const fetchCourses = async (batchId) => {
    const res = await API.get(`/batches/${batchId}/courses`);
    setCourses(res.data);
  };

  const addCourse = async () => {
    if (!selectedBatch) return alert("Select batch first");
    await API.post(`/batches/${selectedBatch}/courses`, form);
    setForm({ code: "", title: "", credits: "", total_hours: "" });
    fetchCourses(selectedBatch);
  };

  const fetchFaculty = async () => {
  const res = await API.get("/faculty");
  const verified = res.data.filter((f) => f.user_id?.isApproved === true);
  setFaculty(verified);
};


  const assignFaculty = async () => {
    await API.post(`/batches/course/${assignData.courseId}/assign`, {
      facultyId: assignData.facultyId,
    });
    alert("Faculty assigned successfully");
    fetchCourses(selectedBatch);
    setAssignData({ courseId: "", facultyId: "" });
  };

  useEffect(() => {
    fetchBatches();
    fetchFaculty();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold text-blue-700 mb-4">
        Batch Management
      </h1>

      {/* Create Batch */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter new batch name"
          value={newBatch}
          onChange={(e) => setNewBatch(e.target.value)}
          className="border rounded-md px-4 py-2"
        />
        <button
          onClick={createBatch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Create Batch
        </button>
      </div>

      {/* Batch List */}
      <div className="flex gap-3 mb-6">
        {batches.map((b) => (
          <button
            key={b._id}
            onClick={() => {
              setSelectedBatch(b._id);
              fetchCourses(b._id);
            }}
            className={`px-4 py-2 rounded-md ${
              selectedBatch === b._id ? "bg-blue-700 text-white" : "bg-white border"
            }`}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Add Course */}
      {selectedBatch && (
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Add Course</h2>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <input
              placeholder="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="border px-3 py-2 rounded-md"
            />
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border px-3 py-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Credits"
              value={form.credits}
              onChange={(e) => setForm({ ...form, credits: e.target.value })}
              className="border px-3 py-2 rounded-md"
            />
            <input
              type="number"
              placeholder="Total Hours"
              value={form.total_hours}
              onChange={(e) => setForm({ ...form, total_hours: e.target.value })}
              className="border px-3 py-2 rounded-md"
            />
          </div>
          <button
            onClick={addCourse}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Add Course
          </button>
        </div>
      )}

      {/* Course List */}
      {courses.length > 0 && (
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Courses in this Batch
          </h2>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Code</th>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">Credits</th>
                <th className="p-2 text-left">Total Hours</th>
                <th className="p-2 text-left">Faculty</th>
                <th className="p-2 text-left">Assign</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c._id} className="border-t">
                  <td className="p-2">{c.code}</td>
                  <td className="p-2">{c.title}</td>
                  <td className="p-2">{c.credits}</td>
                  <td className="p-2">{c.total_hours}</td>
                  <td className="p-2">
                    {c.assigned_faculty
                      ? c.assigned_faculty.name
                      : "Not assigned"}
                  </td>
                  <td className="p-2">
                    <select
                      onChange={(e) =>
                        setAssignData({ courseId: c._id, facultyId: e.target.value })
                      }
                      className="border rounded-md px-2 py-1"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Faculty
                      </option>
                      {faculty.map((f) => (
                        <option key={f._id} value={f._id}>
                          {f.user_id?.name || f.department}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={assignFaculty}
                      className="ml-2 bg-blue-600 text-white px-2 py-1 rounded-md"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
