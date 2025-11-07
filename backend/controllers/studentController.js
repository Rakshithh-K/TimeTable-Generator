import Student from "../models/Student.js";

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const registerStudent = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ user_id: userId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    const studentData = {
      user_id: userId,
      ...req.body
    };
    
    const student = await Student.create(studentData);
    const populatedStudent = await Student.findById(student._id)
      .populate("user_id", "name email")
      .populate("major_courses", "code title credits")
      .populate("minor_courses", "code title credits")
      .populate("optional_courses", "code title credits");
    
    res.status(201).json(populatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOne({ user_id: userId })
      .populate("user_id", "name email")
      .populate("major_courses", "code title credits")
      .populate("minor_courses", "code title credits")
      .populate("optional_courses", "code title credits");
    
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findOneAndUpdate(
      { user_id: userId },
      req.body,
      { new: true }
    ).populate("user_id", "name email")
     .populate("major_courses", "code title credits")
     .populate("minor_courses", "code title credits")
     .populate("optional_courses", "code title credits");
    
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, technologies, githubLink } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { user_id: userId },
      { $push: { projects: { name, description, technologies, githubLink } } },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    
    res.json({ message: "Project added successfully", projects: student.projects });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const addInternship = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role, company } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { user_id: userId },
      { $push: { internships: { role, company } } },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    
    res.json({ message: "Internship added successfully", internships: student.internships });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    
    const student = await Student.findOneAndUpdate(
      { user_id: userId },
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }
    
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const { name, description, technologies, githubLink } = req.body;
    
    const student = await Student.findOneAndUpdate(
      { 
        user_id: userId,
        "projects._id": projectId
      },
      { 
        $set: {
          "projects.$.name": name,
          "projects.$.description": description,
          "projects.$.technologies": technologies,
          "projects.$.githubLink": githubLink
        }
      },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: "Project not found" });
    }
    
    res.json({ message: "Project updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("user_id", "name email");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(student);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
