import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

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

      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, password }
      );

      toast.success(res.data.message || "Password reset successful");

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

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-96 text-white"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        {/* New Password */}
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 rounded-lg outline-none pr-10"
          />
          <span
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-2.5 cursor-pointer"
          >
            {showPass ? <EyeOff /> : <Eye />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-6">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-white/20 rounded-lg outline-none pr-10"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-2.5 cursor-pointer"
          >
            {showConfirm ? <EyeOff /> : <Eye />}
          </span>
        </div>

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className={`w-full py-2 rounded-xl font-semibold transition
            ${loading
              ? "bg-gray-500"
              : "bg-blue-500 hover:bg-blue-600"
            }`}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        <div className="mt-4 text-center text-sm">
          <Link to="/" className="text-blue-400 hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
