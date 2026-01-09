import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AttendanceHistory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-blue-400"
      >
        Attendance History
      </motion.h1>

      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
        <p className="text-gray-300">
          Attendance history will appear here.
        </p>
      </div>

      <div className="mt-6">
        <Link
          to="/home"
          className="text-blue-400 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>

    </div>
  );
}
