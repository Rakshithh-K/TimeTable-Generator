import mongoose from "mongoose";
import Course from "./models/Course.js";
import dotenv from "dotenv";

dotenv.config();

const checkCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const courses = await Course.find();
    console.log('Total courses:', courses.length);
    
    const majorCourses = await Course.find({ category: "major" });
    const minorCourses = await Course.find({ category: "minor" });
    const optionalCourses = await Course.find({ category: "optional" });
    
    console.log('Major courses:', majorCourses.length);
    console.log('Minor courses:', minorCourses.length);
    console.log('Optional courses:', optionalCourses.length);
    
    if (courses.length > 0) {
      console.log('\nSample course:', courses[0]);
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkCourses();