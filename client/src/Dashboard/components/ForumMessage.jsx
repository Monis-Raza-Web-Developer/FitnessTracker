import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

export default function ForumMessage() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const email = user?.email?.trim().toLowerCase();
  const isAdmin = email === "admin@gmail.com";

  const [messages, setMessages] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  if (!isAdmin) {
    return (
      <div className="text-center mt-20 text-red-500 text-xl font-bold">
        Access Denied — Only Admin Can View This Page
      </div>
    );
  }

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/forum`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Fetch messages error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const submitMessage = async () => {
    if (!title.trim() || !text.trim()) return;
    try {
      await axios.post(`${API_BASE}/forum`, { email, title, message: text });
      setTitle("");
      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Submit message error:", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${API_BASE}/forum/${id}`, { data: { email } });
      fetchMessages();
    } catch (err) {
      console.error("Delete message error:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h2 className="text-2xl font-bold mb-6 text-yellow-400">Forum Messages</h2>

      {/* Form */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          className="flex-1 p-3 rounded bg-[#111] border border-gray-700"
          placeholder="Title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="flex-2 p-3 rounded bg-[#111] border border-gray-700"
          placeholder="Write a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={submitMessage}
          className="px-6 py-3 bg-yellow-500 text-black rounded-md font-semibold"
        >
          Send
        </button>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="p-4 bg-[#111] border border-gray-700 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-2"
          >
            <div>
              <h3 className="font-semibold text-lg text-yellow-400">{msg.title}</h3>
              <p className="text-gray-300">{msg.message}</p>
              <p className="text-gray-500 text-sm mt-1">
                By: {msg.userId?.name || "Admin"} | {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>

            <button
              onClick={() => deleteMessage(msg._id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md mt-2 md:mt-0"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
