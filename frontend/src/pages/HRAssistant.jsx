import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Loader, MessageCircle } from "lucide-react";

export default function HRAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your **AI-powered HR Assistant** at IMPLOYEE. I can help you with anything HR-related!\n\nI can answer questions about:\n• 📋 **Leave Balance** - Your remaining leaves\n• 📊 **Attendance** - Your records and statistics\n• 💰 **Payroll** - Salary, deductions, earnings\n• 📜 **HR Policies** - Company guidelines and benefits\n• 👤 **Profile Information** - Your details\n• 🏢 **Platform Features** - How to use IMPLOYEE\n\n*Just ask me any question and I'll help you find the answer!*",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      const response = await fetch("http://localhost:5000/api/hr-assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          userId: userId,
          conversationHistory: messages
            .filter(msg => msg.sender !== undefined)
            .map(msg => ({
              role: msg.sender === "user" ? "user" : "model",
              parts: [{ text: msg.text }]
            }))
        })
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: messages.length + 2,
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
          toolsUsed: data.data ? Object.keys(data.data) : []
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorMessage = {
          id: messages.length + 2,
          text: `❌ Error: ${data.message || "Unable to process your request. Please try again."}`,
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error:", error);
      
      const errorMessage = {
        id: messages.length + 2,
        text: "❌ Sorry, I'm having trouble connecting. Please check your internet and try again.",
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

  const suggestedQuestions = [
    "How many leaves do I have remaining?",
    "What's my attendance percentage?",
    "Tell me about the leave policy",
    "What are my payroll deductions?"
  ];

  const handleSuggestedQuestion = (question) => {
    setInput(question);
    setTimeout(() => {
      document.querySelector('button[aria-label="Send message"]')?.click();
    }, 100);
  };

  const formatMessageText = (text) => {
    return text.split('\n').map((line, idx) => {
      // Convert markdown-style formatting to text
      line = line.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
      return <div key={idx} className="mb-1">{line}</div>;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 rounded-2xl border border-blue-400/20">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                AI HR Assistant
              </h1>
              <p className="text-gray-300 text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Powered by Gemini - Ask anything about HR
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            <AnimatePresence>
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "bot" && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}
                  
                  <div className={`max-w-[75%] ${message.sender === "user" ? "flex flex-col items-end" : ""}`}>
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.sender === "bot"
                        ? "bg-slate-700/50 border border-slate-600/50 text-gray-100"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    }`}>
                      <div className="whitespace-pre-wrap">{formatMessageText(message.text)}</div>
                      
                      {message.toolsUsed && message.toolsUsed.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <div className="text-xs text-gray-300 flex flex-wrap gap-2">
                            {message.toolsUsed.map((tool, i) => (
                              <span key={i} className="bg-white/10 px-2 py-1 rounded">
                                🔧 {tool.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className={`text-xs mt-2 ${
                      message.sender === "bot" ? "text-gray-500" : "text-gray-400"
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-slate-700/50 border border-slate-600/50 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin text-blue-400" />
                    <span className="text-sm text-gray-300">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 pb-4 border-t border-white/10"
            >
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Try asking:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border border-blue-400/20 hover:border-blue-400/40 rounded-xl text-xs text-left text-gray-300 transition-all"
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Input Area */}
          <div className="border-t border-white/10 bg-slate-900/50 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about HR, leaves, policies, payroll..."
                className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition-all"
                disabled={loading}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                aria-label="Send message"
                disabled={loading || !input.trim()}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all flex-shrink-0 ${
                  loading || !input.trim()
                    ? "bg-gray-600 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 hover:from-blue-600 hover:to-purple-700"
                }`}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </div>
  );
}