import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);
  const [user, setUser] = useState(null);

  const today = new Date().toDateString();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    
    if (!token || !userId) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const userData = { _id: userId, name: userName, role };
    setUser(userData);
    fetchTodayAttendance(userId, token);
  }, [navigate]);

  const fetchTodayAttendance = async (userId, token) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/attendance/today/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setAttendance(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      toast.error("Server not responding or unauthorized");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-8">
      <Toaster />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-sky-400">IMPLOYEE</h1>
        <p className="text-gray-300 mt-1">
          Welcome back, <span className="font-semibold">{user.name || user.email}</span>
        </p>
        <p className="text-gray-400 text-sm">{today}</p>
      </div>

      {/* Today's Status */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-red-400 text-2xl">📅</span>
          <h2 className="text-lg font-semibold">Today's Status</h2>
        </div>

        <p className="mt-2 text-lg">
          Attendance:&nbsp;
          {attendance === null ? (
            <span className="text-gray-400">Loading...</span>
          ) : attendance.marked ? (
            <span className="text-green-400 font-semibold">
              Checked In at {attendance.time}
            </span>
          ) : (
            <span className="text-red-400 font-semibold">
              Not Checked In
            </span>
          )}
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Attendance"
          icon="📷"
          onClick={() => navigate("/attendance")}
        />

        <DashboardCard
          title="Profile"
          icon="👤"
          onClick={() => navigate("/profile-dashboard")}
        />
        
        <DashboardCard 
          title="Payroll" 
          icon="💳" 
          onClick={() => navigate("/payroll")}
        />
        
        <DashboardCard 
          title="Analytics" 
          icon="📊" 
          onClick={() => navigate("/analytics")}
        />
        
        <DashboardCard 
          title="HR Assistant" 
          icon="🧠" 
          onClick={() => navigate("/hr-assistant")}
        />

        {/* Manager/Admin Only */}
        {(user.role === 'MANAGER' || user.role === 'ADMIN') && (
          <DashboardCard
            title="Silent Signals"
            icon="🎯"
            onClick={() => navigate("/silent-signals")}
            isSpecial
          />
        )}

        <DashboardCard
          title="Logout"
          icon="➡️"
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('role');
            navigate("/");
          }}
        />
      </div>
    </div>
  );
}

function DashboardCard({ title, icon, onClick, isSpecial }) {
  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-md border rounded-xl p-8
                 flex flex-col items-center justify-center
                 hover:transition cursor-pointer ${
                   isSpecial
                     ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 hover:from-purple-500/30 hover:to-pink-500/30'
                     : 'bg-white/10 border-white/20 hover:bg-white/20'
                 }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-lg font-medium">{title}</p>
    </div>
  );
}