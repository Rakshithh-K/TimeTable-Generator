import React, { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function TimetablePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchTimetable = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE}/timetable/latest`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const timetableData = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];

      const formatted = timetableData.map((item) => ({
        title: `${item.course || "Unknown"} (${item.room || "Room ?"})`,
        start: getDateForSlot(item.day, item.time?.split("-")[0] || "09:00"),
        end: getDateForSlot(item.day, item.time?.split("-")[1] || "10:00"),
      }));

      setEvents(formatted);
    } catch (err) {
      console.error("Fetch failed:", err.response?.data || err.message);
    }
  };

  const generateTimetable = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/timetable/generate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      await fetchTimetable();
    } catch (err) {
      alert(err.response?.data?.message || "Error generating timetable");
    } finally {
      setLoading(false);
    }
  };

  const getDateForSlot = (day, time) => {
    const map = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 };
    const date = new Date();
    const diff = map[day] - date.getDay();
    const slotDate = new Date(date);
    slotDate.setDate(date.getDate() + diff);
    const [h, m] = time.split(":");
    slotDate.setHours(parseInt(h), parseInt(m), 0, 0);
    return slotDate;
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-blue-700">
          AI Timetable Generator
        </h1>
        <button
          onClick={generateTimetable}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? "Generating..." : "Generate Timetable"}
        </button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        events={events}
        height="80vh"
      />
    </div>
  );
}
