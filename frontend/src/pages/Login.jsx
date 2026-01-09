import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      // ✅ STEP 1: SAVE AUTH DATA (VERY IMPORTANT)
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("role", data.user.role);

      toast.success("Login successful!");

      // redirect to home
      navigate("/home");

    } catch (error) {
      toast.error("Server not responding");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Toaster />

      {/* Logo */}
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

        <form className="space-y-5" onSubmit={handleLogin}>
          {/* Email */}
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

          {/* Password with Eye Toggle */}
          <div className="relative">
            <label className="text-sm text-gray-300">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full mt-1 px-4 py-2 bg-white/20 focus:bg-white/30 rounded-lg outline-none transition pr-10"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-300 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-3 bg-blue-500 hover:bg-blue-600 transition text-white rounded-xl font-semibold shadow-lg hover:shadow-blue-500/50"
          >
            Login
          </button>
        </form>

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
