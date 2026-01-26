import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./pages/landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProfileDashboard from "./pages/ProfileDashboard";
import FaceAttendance from "./pages/FaceAttendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import ManagerDashboard from './pages/ManagerDashboard';
import HRAssistant from './pages/HRAssistant';
import Payroll from './pages/Payroll'; // ✅ ADD THIS LINE
import TestPayroll from './pages/TestPayroll'; // Add import

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 LANDING PAGE */}
        <Route path="/" element={<Landing />} />

        {/* 🔐 AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🏠 MAIN APP */}
        <Route path="/home" element={<Home />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} /> 
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-dashboard" element={<ProfileDashboard />} />
        <Route path="/hr-assistant" element={<HRAssistant />} />
        <Route path="/test-payroll" element={<TestPayroll />} />

        {/* 📸 ATTENDANCE */}
        <Route path="/attendance" element={<FaceAttendance />} />
        <Route path="/attendance-history" element={<AttendanceHistory />} />

        {/* 💰 PAYROLL */}
        <Route path="/payroll" element={<Payroll />} /> {/* ✅ ADD THIS LINE */}

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}