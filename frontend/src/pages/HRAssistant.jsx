import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Calendar, FileText, Loader } from "lucide-react";

export default function HRAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your HR Assistant. I can help you with:\n• Leave balances\n• Company policies\n• Attendance records\n• HR queries\n\nHow can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch employee analytics data
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchEmployeeData(userId);
    }
  }, []);

  const fetchEmployeeData = async (userId) => {
    try {
      // Fetch attendance and leave data
      const [attendanceRes, leaveRes] = await Promise.all([
        fetch(`http://localhost:5000/api/attendance/analytics/${userId}`),
        fetch(`http://localhost:5000/api/leave/history/${userId}`)
      ]);

      const attendanceData = await attendanceRes.json();
      const leaveData = await leaveRes.json();

      setEmployeeData({
        attendance: attendanceData,
        leaves: leaveData
      });
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send to backend AI assistant
      const response = await fetch("http://localhost:5000/api/hr-assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          message: input,
          userId: localStorage.getItem("userId"),
          employeeData: employeeData
        })
      });

      const data = await response.json();

      const botMessage = {
        id: messages.length + 2,
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
        data: data.data // Additional structured data if needed
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "How many leaves do I have left?",
    "What's my attendance percentage?",
    "Company leave policy",
    "How do I apply for leave?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-5xl mx-auto h-[calc(100vh-3rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                HR Assistant
              </h1>
              <p className="text-gray-400 text-sm">AI-powered help for all your HR queries</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === "bot" 
                      ? "bg-gradient-to-br from-blue-500 to-purple-600" 
                      : "bg-gradient-to-br from-green-500 to-teal-600"
                  }`}>
                    {message.sender === "bot" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  
                  <div className={`max-w-[70%] ${message.sender === "user" ? "items-end" : ""}`}>
                    <div className={`rounded-2xl p-4 ${
                      message.sender === "bot"
                        ? "bg-white/10 border border-white/20"
                        : "bg-gradient-to-br from-blue-500 to-purple-600"
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      
                      {message.data && (
                        <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
                          {message.data.leaveBalance && (
                            <div className="flex items-center gap-2 text-xs">
                              <Calendar className="w-4 h-4" />
                              <span>Leave Balance: {message.data.leaveBalance}</span>
                            </div>
                          )}
                          {message.data.attendanceRate && (
                            <div className="flex items-center gap-2 text-xs">
                              <FileText className="w-4 h-4" />
                              <span>Attendance: {message.data.attendanceRate}%</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-400 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about HR, leaves, policies..."
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                disabled={loading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                  loading || !input.trim()
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50"
                }`}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}