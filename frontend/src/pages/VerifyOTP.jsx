

import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Toaster />

      {/* Splash Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3, ease: "easeOut" }}
        className="absolute top-20 text-center"
      >
        <motion.h1
          initial={{ letterSpacing: "10px" }}
          animate={{ letterSpacing: "3px" }}
          transition={{ duration: 1.5 }}
          className="tracking-wide text-5xl font-extrabold text-white"
        >
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text drop-shadow-lg">
            IMPLOYEE
          </span>
        </motion.h1>

        <p className="text-gray-400 text-sm mt-2 tracking-[2px] uppercase">
          Smart HR System
        </p>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="bg-white/10 backdrop-blur-md shadow-xl border border-white/20 rounded-2xl p-8 w-96 text-white mt-32"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 tracking-wide">
          Login to Continue
        </h2>

        <form className="space-y-5">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              className="w-full mt-1 px-4 py-2 bg-white/20 focus:bg-white/30 rounded-lg outline-none transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              className="w-full mt-1 px-4 py-2 bg-white/20 focus:bg-white/30 rounded-lg outline-none transition"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-3 bg-blue-500 hover:bg-blue-600 transition text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50"
            onClick={(e) => {
              e.preventDefault();
              toast.success("Login Successful!");
            }}
          >
            Login
          </button>
        </form>

        {/* FIXED LINK */}
        <div className="mt-4 text-center text-sm text-gray-300">
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="mt-6 text-center">
          <span className="text-gray-400">Don’t have an account? </span>
          <Link
            to="/signup"
            className="text-blue-400 font-semibold hover:text-blue-500 transition"
          >
            Create Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
