import Batch from "../models/Batch.js";
import Course from "../models/Course.js";
import Faculty from "../models/Faculty.js";

// ➕ Create Batch
export const createBatch = async (req, res) => {
  try {
    const batch = await Batch.create({ name: req.body.name });
    res.status(201).json(batch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📋 Get All Batches
export const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Add Course to Batch
export const addCourseToBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const { code, title, credits, total_hours } = req.body;

    const course = await Course.create({
      batch: batchId,
      code,
      title,
      credits,
      total_hours,
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📋 Get Courses for a Batch
export const getCoursesByBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const courses = await Course.find({ batch: batchId }).populate("assigned_faculty");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👩‍🏫 Assign Faculty to a Course
export const assignFaculty = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { facultyId } = req.body;

    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    const updated = await Course.findByIdAndUpdate(
      courseId,
      { assigned_faculty: facultyId },
      { new: true }
    ).populate("assigned_faculty");

    res.json({ message: "Faculty assigned successfully", course: updated });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
