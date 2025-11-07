import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ActivitySection({ studentData }) {
  const { token } = useAuth();
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    technologies: "",
    githubLink: ""
  });
  const [internshipForm, setInternshipForm] = useState({
    role: "",
    company: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const semester = studentData?.year || 1;
  const isProjectSemester = semester <= 6;

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const url = editingProject 
        ? `${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/students/project/${editingProject._id}`
        : `${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/students/add-project`;
      
      const method = editingProject ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(projectForm)
      });

      if (response.ok) {
        setMessage(editingProject ? "Project updated successfully!" : "Project added successfully!");
        setProjectForm({ name: "", description: "", technologies: "", githubLink: "" });
        setEditingProject(null);
        window.location.reload(); // Refresh to show updated data
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to add project");
      }
    } catch (error) {
      setMessage("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInternshipSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/students/add-internship`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(internshipForm)
      });

      if (response.ok) {
        setMessage("Internship added successfully!");
        setInternshipForm({ role: "", company: "" });
      } else {
        const error = await response.json();
        setMessage(error.message || "Failed to add internship");
      }
    } catch (error) {
      setMessage("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProject = (project) => {
    setProjectForm({
      name: project.name,
      description: project.description,
      technologies: project.technologies,
      githubLink: project.githubLink || ""
    });
    setEditingProject(project);
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'}/students/project/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setMessage("Project deleted successfully!");
        window.location.reload();
      }
    } catch (error) {
      setMessage("Failed to delete project");
    }
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setProjectForm({ name: "", description: "", technologies: "", githubLink: "" });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Activity</h2>
      
      {message && (
        <div className={`mb-4 p-4 rounded-md ${
          message.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {message}
        </div>
      )}

      {isProjectSemester ? (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Project Section (Semester {semester})</h3>
          
          {/* Display existing projects */}
          {studentData?.projects && studentData.projects.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Your Projects</h4>
              <div className="space-y-3">
                {studentData.projects.map((project, index) => (
                  <div key={index} className="bg-blue-50 p-4 rounded-md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h5 className="font-medium text-blue-900">{project.name}</h5>
                        <p className="text-blue-700 text-sm mt-1">{project.description}</p>
                        <p className="text-blue-600 text-sm mt-1"><strong>Technologies:</strong> {project.technologies}</p>
                        {project.githubLink && (
                          <p className="text-blue-600 text-sm mt-1">
                            <strong>GitHub:</strong> 
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">
                              {project.githubLink}
                            </a>
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditProject(project)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleProjectSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectForm.name}
                onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe your project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <input
                type="text"
                value={projectForm.technologies}
                onChange={(e) => setProjectForm({...projectForm, technologies: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Link
              </label>
              <input
                type="url"
                value={projectForm.githubLink}
                onChange={(e) => setProjectForm({...projectForm, githubLink: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/username/repository"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? (editingProject ? "Updating..." : "Adding...") : (editingProject ? "Update Project" : "Add Project")}
              </button>
              {editingProject && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Internship Section (Semester {semester})</h3>
          
          {/* Display existing internships */}
          {studentData?.internships && studentData.internships.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Your Internships</h4>
              <div className="space-y-3">
                {studentData.internships.map((internship, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-md">
                    <h5 className="font-medium text-green-900">{internship.role}</h5>
                    <p className="text-green-700 text-sm mt-1"><strong>Company:</strong> {internship.company}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleInternshipSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={internshipForm.role}
                onChange={(e) => setInternshipForm({...internshipForm, role: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Developer Intern"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={internshipForm.company}
                onChange={(e) => setInternshipForm({...internshipForm, company: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter company name"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Internship"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}