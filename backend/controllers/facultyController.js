import Faculty from "../models/Faculty.js";

export const createFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.create(req.body);
    res.status(201).json(faculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().populate("user_id", "name email");
    res.json(faculty);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(faculty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteFaculty = async (req, res) => {
  try {
    await Faculty.findByIdAndDelete(req.params.id);
    res.json({ message: "Faculty deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
