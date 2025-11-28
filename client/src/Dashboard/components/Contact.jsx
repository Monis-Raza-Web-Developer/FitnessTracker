import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE ="http://localhost:3000"; 


const Contact = () => {
  const [messages, setMessages] = useState([]);

  const [error, setError] = useState("");

  const fetchMessages = async () => {
  
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/messages`);
      
      setMessages(res.data.message);
      console.log(res.data)
    } catch (err) {
      console.error("Fetch messages error:", err);
      setError("Failed to load messages. Check backend URL / network.");
    } 
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-yellow-400">All Messages</h1>
         
         
        </div>

        <div className="bg-gradient-to-b from-yellow-900/10 to-black/20 border border-yellow-500/20 rounded-xl overflow-hidden">
          {error ? (
            <div className="p-6 text-center text-red-400">{error}</div>
          ) : messages.length === 0 ? (
            <div className="p-6 text-center text-gray-300">No messages found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-yellow-600/20">
                <thead className="bg-yellow-500/10">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-yellow-300">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-yellow-300">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-yellow-300">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-yellow-300">Subject</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-yellow-300">Message</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-yellow-300">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-black/40 divide-y divide-yellow-600/10">
                  {messages.map((msg, idx) => (
                    <tr key={msg._id ?? idx} className="hover:bg-yellow-500/5 transition-colors">
                      <td className="px-4 py-3 text-sm text-yellow-200">{idx + 1}</td>
                      <td className="px-4 py-3 text-sm text-white">{msg.name}</td>
                      <td className="px-4 py-3 text-sm text-yellow-100">{msg.email}</td>
                      <td className="px-4 py-3 text-sm text-yellow-100">{msg.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-200 max-w-xl break-words">
                        {msg.message}
                      </td>
                      <td className="px-4 py-3 text-sm text-yellow-200">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleString()
                          : msg.createdAt === undefined && msg.date
                          ? new Date(msg.date).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
