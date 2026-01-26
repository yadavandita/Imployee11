import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";

export default function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await fetch(`http://localhost:5000/api/attendance/history/${user._id}`);
        const data = await res.json();
        
        if (data.success) {
          setHistory(data.history);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      
      <div className="max-w-4xl mx-auto">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 flex items-center gap-3"
        >
          <Calendar className="text-blue-400" />
          Attendance History
        </motion.h1>

        {loading ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-300">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center">
            <p className="text-gray-300">No attendance records found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-blue-400/50 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={18} className="text-blue-400" />
                      <span className="font-semibold">{record.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Check-in: {new Date(record.checkInTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {record.checkOutTime && (
                        <div className="flex items-center gap-1">
                          <Clock size={16} />
                          <span>Check-out: {new Date(record.checkOutTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      record.status === 'PRESENT' ? 'bg-green-500/20 text-green-400' : 
                      record.status === 'LATE' ? 'bg-yellow-500/20 text-yellow-400' : 
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {record.status}
                    </span>
                    {record.deviceType && (
                      <p className="text-xs text-gray-400 mt-2">
                        Device: {record.deviceType}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}