import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailRegex =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Send OTP
  const sendOtp = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setOtpSent(true);
      toast.success("OTP sent to your email");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.join("").length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: otp.join("")
      });

      toast.success("OTP verified! Redirecting...");

      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1200);

    } catch {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Toaster />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.3 }}
        className="absolute top-20 text-center"
      >
        <h1 className="text-5xl font-extrabold text-white tracking-wide">
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
            IMPLOYEE
          </span>
        </h1>
        <p className="text-gray-400 text-sm mt-2 tracking-[2px] uppercase">
          Smart HR System
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
        className="bg-white/10 backdrop-blur-md shadow-xl border border-white/20 rounded-2xl p-8 w-96 text-white mt-32"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          disabled={otpSent}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-white/20 focus:bg-white/30 rounded-lg outline-none transition"
        />

        {!otpSent ? (
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition shadow-lg hover:shadow-blue-500/40"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            {/* OTP Boxes */}
            <div className="flex justify-between my-5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  className="w-10 h-12 text-center text-black text-lg rounded-lg outline-none"
                />
              ))}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full py-2 bg-green-500 hover:bg-green-600 rounded-xl font-semibold transition shadow-lg hover:shadow-green-500/40"
            >
              Verify OTP
            </button>
          </>
        )}

        <div className="mt-6 text-center text-sm text-gray-300">
          <Link to="/login" className="hover:text-blue-400 transition">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
