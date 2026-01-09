import { motion } from "framer-motion";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // Email passed from ForgotPassword page
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔐 VERIFY OTP (BACKEND)
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp
      });

      setOtpVerified(true);
      toast.success("OTP verified. You can reset password now");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔐 RESET PASSWORD (BACKEND)
  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])\S{8,}$/.test(password)) {
      toast.error(
        "Password must have 8 chars, 1 capital, 1 number & 1 special character"
      );
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        password
      });

      toast.success("Password reset successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Toaster />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute top-20 text-center"
      >
        <h1 className="text-5xl font-extrabold tracking-wide text-white">
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
          Reset Password
        </h2>

        {/* OTP */}
        <input
          type="text"
          maxLength={6}
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={otpVerified}
          className="w-full mb-3 px-4 py-2 bg-white/20 focus:bg-white/30 rounded-lg outline-none text-center tracking-widest"
        />

        <button
          onClick={verifyOtp}
          disabled={otpVerified || loading}
          className="w-full py-2 mb-5 bg-cyan-500 hover:bg-cyan-600 rounded-xl font-semibold transition disabled:opacity-50"
        >
          Verify OTP
        </button>

        {/* New Password */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!otpVerified}
            className="w-full px-4 py-2 bg-white/20 rounded-lg outline-none pr-10 disabled:opacity-40"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-6">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!otpVerified}
            className="w-full px-4 py-2 bg-white/20 rounded-lg outline-none pr-10 disabled:opacity-40"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2.5 cursor-pointer"
          >
            {showConfirm ? <EyeOff /> : <Eye />}
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/login"
            className="text-center py-2 rounded-xl text-gray-300 border border-gray-500 hover:border-blue-400 hover:text-blue-400 transition"
          >
            Back to Login
          </Link>

          <button
            onClick={handleResetPassword}
            disabled={!otpVerified || loading}
            className={`py-2 rounded-xl font-semibold transition
              ${
                otpVerified
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
          >
            Reset Password
          </button>
        </div>
      </motion.div>
    </div>
  );
}
