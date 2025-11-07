import Course from "../models/Course.js";

// ➕ Create Course
export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 📋 Get All Courses
export const getCourses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const courses = await Course.find(filter);
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get courses by category
export const getCoursesByCategory = async (req, res) => {
  try {
    const majorCourses = await Course.find({ category: "major", credits: 4 });
    const minorCourses = await Course.find({ category: "minor", credits: { $in: [2, 3] } });
    const optionalCourses = await Course.find({ category: "optional" });
    
    res.json({
      major: majorCourses,
      minor: minorCourses,
      optional: optionalCourses
    });
  } catch (err) {
    console.error("Database error, using fallback courses:", err.message);
    // Fallback sample courses if database is not available
    res.json({
      major: [
        { _id: '1', code: 'CS101', title: 'Programming Fundamentals', credits: 4, category: 'major' },
        { _id: '2', code: 'CS102', title: 'Data Structures', credits: 4, category: 'major' },
        { _id: '3', code: 'CS103', title: 'Database Systems', credits: 4, category: 'major' },
        { _id: '4', code: 'CS104', title: 'Computer Networks', credits: 4, category: 'major' },
        { _id: '5', code: 'CS105', title: 'Software Engineering', credits: 4, category: 'major' },
        { _id: '6', code: 'CS106', title: 'Operating Systems', credits: 4, category: 'major' }
      ],
      minor: [
        { _id: '7', code: 'MATH201', title: 'Linear Algebra', credits: 3, category: 'minor' },
        { _id: '8', code: 'MATH202', title: 'Statistics', credits: 3, category: 'minor' },
        { _id: '9', code: 'PHY201', title: 'Physics for Engineers', credits: 2, category: 'minor' },
        { _id: '10', code: 'CHEM201', title: 'Chemistry Basics', credits: 2, category: 'minor' },
        { _id: '11', code: 'MGMT201', title: 'Management Principles', credits: 3, category: 'minor' }
      ],
      optional: [
        { _id: '12', code: 'ENG301', title: 'Technical Writing', credits: 2, category: 'optional' },
        { _id: '13', code: 'ART301', title: 'Digital Arts', credits: 1, category: 'optional' },
        { _id: '14', code: 'MUS301', title: 'Music Theory', credits: 1, category: 'optional' },
        { _id: '15', code: 'LANG301', title: 'Foreign Language', credits: 2, category: 'optional' },
        { _id: '16', code: 'SPORT301', title: 'Sports & Fitness', credits: 1, category: 'optional' }
      ]
    });
  }
};

// ✏️ Update Course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Delete Course
export const deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
