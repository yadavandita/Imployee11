import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const USER_ID = "TEMP_USER_ID"; // later replace with real logged-in user id

export default function Home() {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);

  const today = new Date().toDateString();

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/attendance/today/${USER_ID}`
      );

      if (!res.ok) throw new Error("Bad response");

      const data = await res.json();
      setAttendance(data);
    } catch (err) {
      console.error(err);
      toast.error("Server not responding");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white p-8">
      <Toaster />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-sky-400">IMPLOYEE</h1>
        <p className="text-gray-300 mt-1">
          Welcome back, <span className="font-semibold">Vandita</span>
        </p>
        <p className="text-gray-400 text-sm">{today}</p>
      </div>

      {/* Today's Status */}
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-red-400 text-2xl">📅</span>
          <h2 className="text-lg font-semibold">Today’s Status</h2>
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
          onClick={() => navigate("/profile")}
        />
        
        <DashboardCard title="Payroll" icon="💳" />
        <DashboardCard title="Analytics" icon="📊" />
        <DashboardCard title="HR Assistant" icon="🧠" />

        <DashboardCard
          title="Logout"
          icon="➡️"
          onClick={() => navigate("/")}
        />
      </div>
    </div>
  );
}

/* Card Component */
function DashboardCard({ title, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8
                 flex flex-col items-center justify-center
                 hover:bg-white/20 transition cursor-pointer"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-lg font-medium">{title}</p>
    </div>
  );
}
