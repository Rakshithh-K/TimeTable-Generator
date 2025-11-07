import mongoose from "mongoose";
import Course from "./models/Course.js";
import Batch from "./models/Batch.js";
import dotenv from "dotenv";

dotenv.config();

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create a default batch first
    let batch = await Batch.findOne();
    if (!batch) {
      batch = await Batch.create({
        name: "Default Batch",
        year: 2024,
        semester: 1
      });
    }

    // Clear existing courses
    await Course.deleteMany({});

    // Major courses (4 credits)
    const majorCourses = [
      { code: "CS101", title: "Programming Fundamentals", credits: 4, category: "major", batch: batch._id, total_hours: 60 },
      { code: "CS102", title: "Data Structures", credits: 4, category: "major", batch: batch._id, total_hours: 60 },
      { code: "CS103", title: "Database Systems", credits: 4, category: "major", batch: batch._id, total_hours: 60 },
      { code: "CS104", title: "Computer Networks", credits: 4, category: "major", batch: batch._id, total_hours: 60 },
      { code: "CS105", title: "Software Engineering", credits: 4, category: "major", batch: batch._id, total_hours: 60 },
      { code: "CS106", title: "Operating Systems", credits: 4, category: "major", batch: batch._id, total_hours: 60 }
    ];

    // Minor courses (2-3 credits)
    const minorCourses = [
      { code: "MATH201", title: "Linear Algebra", credits: 3, category: "minor", batch: batch._id, total_hours: 45 },
      { code: "MATH202", title: "Statistics", credits: 3, category: "minor", batch: batch._id, total_hours: 45 },
      { code: "PHY201", title: "Physics for Engineers", credits: 2, category: "minor", batch: batch._id, total_hours: 30 },
      { code: "CHEM201", title: "Chemistry Basics", credits: 2, category: "minor", batch: batch._id, total_hours: 30 },
      { code: "MGMT201", title: "Management Principles", credits: 3, category: "minor", batch: batch._id, total_hours: 45 }
    ];

    // Optional courses
    const optionalCourses = [
      { code: "ENG301", title: "Technical Writing", credits: 2, category: "optional", batch: batch._id, total_hours: 30 },
      { code: "ART301", title: "Digital Arts", credits: 1, category: "optional", batch: batch._id, total_hours: 15 },
      { code: "MUS301", title: "Music Theory", credits: 1, category: "optional", batch: batch._id, total_hours: 15 },
      { code: "LANG301", title: "Foreign Language", credits: 2, category: "optional", batch: batch._id, total_hours: 30 },
      { code: "SPORT301", title: "Sports & Fitness", credits: 1, category: "optional", batch: batch._id, total_hours: 15 }
    ];

    await Course.insertMany([...majorCourses, ...minorCourses, ...optionalCourses]);
    
    console.log("Sample courses created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding courses:", error);
    process.exit(1);
  }
};

seedCourses();