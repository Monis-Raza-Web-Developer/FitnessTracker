// src/components/FeedbackForm.jsx

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, Edit3, Trash2, Save } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

export default function FeedbackForm() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const [feedbacks, setFeedbacks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState({});

  // ---------------- VALIDATION -------------------
  const validate = () => {
    const errors = {};
    if (!name) errors.name = "Please enter your name";
    if (!email) errors.email = "Please enter your email";
    if (!rating) errors.rating = "Please give a rating";
    if (!message) errors.message = "Please write your feedback";

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------------- FETCH USER FEEDBACKS -------------------
  const loadUserFeedback = async () => {
    if (!userId) return;

    try {
      const res = await axios.get(`${API_BASE}/feedback/${userId}`);
      setFeedbacks(res.data.feedback || []);
    } catch (err) {
      console.log("Error fetching feedback:", err);
    }
  };

  useEffect(() => {
    loadUserFeedback();
  }, []);

  // ---------------- SUBMIT / UPDATE -------------------
  const submitFeedback = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);

    const payload = {
      userId,
      name,
      email,
      rating,
      message,
    };

    try {
      // If editing → update
      if (editingId) {
        await axios.put(`${API_BASE}/feedback/${editingId}`, payload);
        alert("Feedback updated!");
      } else {
        // Otherwise → new feedback
        await axios.post(`${API_BASE}/feedback`, payload);
        alert("Feedback submitted!");
      }

      setName("");
      setEmail("");
      setRating("");
      setMessage("");
      setEditingId(null);

      loadUserFeedback();
    } catch (err) {
      console.log("Submit error:", err);
    } finally {
      setSaving(false);
    }
  };

  // ---------------- DELETE FEEDBACK -------------------
  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await axios.delete(`${API_BASE}/feedback/${id}`);
      loadUserFeedback();
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // ---------------- EDIT ACTION -------------------
  const editFeedback = (fb) => {
    setEditingId(fb._id);

    setName(fb.name);
    setEmail(fb.email);
    setRating(fb.rating);
    setMessage(fb.message);
  };

  // ---------------- UI START -------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 p-6 rounded-lg shadow-md"
      style={{
        backgroundColor: "#000",
        border: "1px solid #333",
      }}
    >
      <h3 className="text-xl font-semibold mb-4 text-orange-400">
        {editingId ? "Edit Feedback" : "Feedback Form"}
      </h3>

      {/* ---------------- FORM ----------------*/}
      <form
        onSubmit={submitFeedback}
        className="grid md:grid-cols-2 gap-4" noValidate
      >
        {/* NAME */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-md bg-[#111] text-white border border-gray-600"
            placeholder="Your name"
          />
          <p className="mb-2 text-xs text-red-500">{error.name}</p>
        </div>

        {/* EMAIL */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-300">Email</label>
          <input
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-md bg-[#111] text-white border border-gray-600"
            placeholder="Your email"
          />
          <p className="mb-2 text-xs text-red-500">{error.email}</p>
        </div>

        {/* RATING */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-gray-300">Rating</label>

          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="p-3 rounded-md bg-[#111] text-white border border-gray-600"
          >
            <option value="">Select Rating</option>
            {["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"].map((stars, index) => (
              <option key={index} value={stars} className="bg-black text-white">
                {stars}
              </option>
            ))}
          </select>

          <p className="mb-2 text-xs text-red-500">{error.rating}</p>
        </div>

        {/* MESSAGE */}
        <div className="flex flex-col md:col-span-2">
          <label className="text-sm font-medium mb-1 text-gray-300">
            Feedback
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your feedback..."
            className="p-3 rounded-md bg-[#111] text-white border border-gray-600 h-28"
          />
          <p className="mb-2 text-xs text-red-500">{error.message}</p>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-md font-medium text-black w-full md:w-auto"
            style={{
              background: "linear-gradient(to right, #facc15, #fb923c)",
            }}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : editingId ? (
              <Save className="w-4 h-4 text-black" />
            ) : (
              <Send className="w-4 h-4 text-black" />
            )}

            {saving
              ? "Saving…"
              : editingId
              ? "Update Feedback"
              : "Submit Feedback"}
          </button>
        </div>
      </form>

      {/* ---------------- FEEDBACK LIST ----------------*/}
      <div className="mt-8">
        <h3 className="text-orange-400 text-lg font-semibold mb-3">
          Your Feedbacks
        </h3>

        {feedbacks.length === 0 ? (
          <p className="text-gray-400 text-sm">No feedback found.</p>
        ) : (
        
          <div className="">
            
           
            
             
                    <table className="w-full text-left text-gray-300 border-collapse mt-6">
  <thead>
    <tr className="bg-[#111] border-b border-gray-700">
      <th className="p-3">Name</th>
      <th className="p-3">Email</th>
      <th className="p-3">Feedback</th>
      <th className="p-3">Rating</th>
      <th className="p-3 text-center">Action</th>
    </tr>
  </thead>

  <tbody>
     {feedbacks.map((fb) => (
    <tr className="bg-[#0d0d0d] border-b border-gray-800 hover:bg-[#1a1a1a] transition">
      <td className="p-3">{fb.name}</td>
      <td className="p-3">{fb.email}</td>
      <td className="p-3">{fb.message}</td>
      <td className="p-3 text-yellow-400">{fb.rating}</td>

      <td className="p-3 flex items-center gap-3 justify-center">
        {/* EDIT BUTTON */}
        <button
          onClick={() => editFeedback(fb)}
          className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Edit
        </button>

        {/* DELETE BUTTON */}
        <button
          onClick={() => deleteFeedback(fb._id)}
          className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
      ))}
  </tbody>
</table>

                

              
              
          
          </div>
        )}
      </div>
    </motion.div>
  );
}
