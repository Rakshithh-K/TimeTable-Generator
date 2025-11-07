import Course from "../models/Course.js";
import Faculty from "../models/Faculty.js";
import Room from "../models/Room.js";
import Timetable from "../models/Timetable.js";

// Simple time slots for demonstration (1-hour slots)
const timeSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const generateNaiveTimetable = async (req, res) => {
  try {
    const courses = await Course.find();
    const faculty = await Faculty.find();
    const rooms = await Room.find();

    if (!courses.length || !faculty.length || !rooms.length)
      return res.status(400).json({ message: "Missing data for generation" });

    const timetable = [];
    let slotIndex = 0;
    let dayIndex = 0;

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const facultyAssigned = faculty[i % faculty.length];
      const roomAssigned = rooms[i % rooms.length];

      timetable.push({
  course: course.title,
  faculty: facultyAssigned.name || facultyAssigned.department || "N/A",
  room: roomAssigned.name,
  day: days[dayIndex],
  time: timeSlots[slotIndex],
});


      slotIndex++;
      if (slotIndex >= timeSlots.length) {
        slotIndex = 0;
        dayIndex = (dayIndex + 1) % days.length;
      }
    }

    const saved = await Timetable.create({
      version_name: `v${Date.now()}`,
      data: timetable,
    });

    res.json({
      message: "Naive timetable generated successfully",
      totalSessions: timetable.length,
      timetable: saved.data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Generation failed", error: err.message });
  }
};

export const getLatestTimetable = async (req, res) => {
  const latest = await Timetable.findOne().sort({ created_at: -1 });
  if (!latest) return res.status(404).json({ message: "No timetable found" });
  res.json({ data: latest.data }); // ✅ wrap inside object
};

