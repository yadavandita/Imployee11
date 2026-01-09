import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Camera,
  ShieldCheck,
  BarChart3,
  Brain,
  Users,
  Clock
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">

      {/* HERO SECTION */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-6xl md:text-7xl font-extrabold tracking-wide"
        >
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
            IMPLOYEE
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-4 text-gray-300 text-lg md:text-xl tracking-wide"
        >
          Smart Attendance • Secure HR • Intelligent Workforce
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 max-w-xl text-gray-400 text-sm md:text-base"
        >
          IMPLOYEE is a modern employee management platform combining
          facial attendance, secure authentication, payroll automation,
          and analytics — built for the future of work.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-10"
        >
          <Link
            to="/login"
            className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition font-semibold shadow-lg hover:shadow-blue-500/40"
          >
            Get Started
          </Link>
        </motion.div>
      </div>

      {/* FEATURES SECTION */}
      <div className="px-6 pb-24 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {[
          {
            icon: <Camera size={28} />,
            title: "Face Attendance",
            desc: "Biometric attendance using live camera capture and verification."
          },
          {
            icon: <ShieldCheck size={28} />,
            title: "Secure Authentication",
            desc: "JWT-based login, OTP recovery, and encrypted passwords."
          },
          {
            icon: <Clock size={28} />,
            title: "Real-Time Tracking",
            desc: "Live check-in, check-out and attendance status updates."
          },
          {
            icon: <Users size={28} />,
            title: "Employee Management",
            desc: "Manage employees, profiles, and attendance history easily."
          },
          {
            icon: <BarChart3 size={28} />,
            title: "Analytics & Reports",
            desc: "Attendance insights, trends, and performance metrics."
          },
          {
            icon: <Brain size={28} />,
            title: "AI HR Assistant",
            desc: "Intelligent HR queries and automated responses."
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 cursor-pointer hover:border-blue-400 transition"
          >
            <div className="flex items-center gap-3 mb-3 text-blue-400">
              {item.icon}
              <h3 className="text-lg font-semibold text-white">
                {item.title}
              </h3>
            </div>
            <p className="text-gray-400 text-sm">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-white/10">
        © {new Date().getFullYear()} IMPLOYEE • Smart HR System
      </footer>
    </div>
  );
}
