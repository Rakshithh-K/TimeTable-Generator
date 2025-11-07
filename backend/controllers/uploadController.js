import fs from "fs";
import csv from "csv-parser";
import Course from "../models/Course.js";
import Faculty from "../models/Faculty.js";
import Student from "../models/Student.js";
import Room from "../models/Room.js";

const validators = {
  courses: ["code", "title", "program", "semester", "credits"],
  faculty: ["department", "max_weekly_hours"],
  students: ["program", "year"],
  rooms: ["name", "capacity", "building"],
};

export const uploadCSV = async (req, res) => {
  try {
    const { type } = req.query;
    if (!type || !validators[type]) {
      return res.status(400).json({ message: "Invalid upload type" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        const missing = validators[type].filter((f) => !row[f]);
        if (missing.length) {
          errors.push({ row, missing });
        } else {
          results.push(row);
        }
      })
      .on("end", async () => {
        fs.unlinkSync(req.file.path);

        if (results.length === 0)
          return res
            .status(400)
            .json({ message: "No valid records", errors });

        let inserted = [];

        try {
          switch (type) {
            case "courses":
              inserted = await Course.insertMany(results, {
                ordered: false, // continue on duplicates
              });
              break;
            case "faculty":
              inserted = await Faculty.insertMany(results, {
                ordered: false,
              });
              break;
            case "students":
              inserted = await Student.insertMany(results, {
                ordered: false,
              });
              break;
            case "rooms":
              inserted = await Room.insertMany(results, {
                ordered: false,
              });
              break;
          }
        } catch (err) {
          // Handle duplicate key errors gracefully
          if (err.writeErrors) {
            err.writeErrors.forEach((we) => {
              errors.push({
                message: we.err.errmsg,
                code: we.err.code,
                record: we.err.op,
              });
            });
          } else {
            console.error("Upload insert error:", err);
          }
        }

        res.json({
          message: `${inserted.length} ${type} imported successfully (duplicates skipped)`,
          errorsCount: errors.length,
          errors,
        });
      });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
