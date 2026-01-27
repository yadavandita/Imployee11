import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProfileDashboard from "./pages/ProfileDashboard";
import FaceAttendance from "./pages/FaceAttendance";
import AttendanceHistory from "./pages/AttendanceHistory";
import ManagerDashboard from './pages/ManagerDashboard';
import HRAssistant from './pages/HRAssistant';
import Payroll from './pages/Payroll';
import Analytics from './pages/Analytics';
import SilentSignalsDashboard from './pages/SilentSignalsDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔐 LANDING PAGE */}
        <Route path="/" element={<Landing />} />

        {/* 🔐 AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🏠 MAIN APP (PROTECTED) */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile-dashboard" element={<ProtectedRoute><ProfileDashboard /></ProtectedRoute>} />
        <Route path="/hr-assistant" element={<ProtectedRoute><HRAssistant /></ProtectedRoute>} />

        {/* 📸 ATTENDANCE (PROTECTED) */}
        <Route path="/attendance" element={<ProtectedRoute><FaceAttendance /></ProtectedRoute>} />
        <Route path="/attendance-history" element={<ProtectedRoute><AttendanceHistory /></ProtectedRoute>} />

        {/* 📊 MANAGER DASHBOARDS (PROTECTED) */}
        <Route path="/manager-dashboard" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
        <Route path="/silent-signals" element={<ProtectedRoute><SilentSignalsDashboard /></ProtectedRoute>} />

        {/* 💰 PAYROLL (PROTECTED) */}
        <Route path="/payroll" element={<ProtectedRoute><Payroll /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}