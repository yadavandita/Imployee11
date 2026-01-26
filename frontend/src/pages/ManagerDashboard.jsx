import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  LogOut
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const [userName, setUserName] = useState("Manager");
  const [currentDate, setCurrentDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 🔐 ROLE GUARD
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("userName");

    if (!role || (role.toUpperCase() !== "MANAGER" && role.toUpperCase() !== "ADMIN")) {
      navigate("/login");
      return;
    }

    setUserName(name || "Manager");

    const date = new Date();
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    setCurrentDate(date.toLocaleDateString("en-US", options));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const cards = [
    {
      title: "Employee Management",
      icon: <Users className="w-12 h-12" />,
      color: "from-blue-500 to-cyan-500",
      route: "/manager/employees"
    },
    {
      title: "Attendance Overview",
      icon: <Calendar className="w-12 h-12" />,
      color: "from-purple-500 to-pink-500",
      route: "/manager/attendance"
    },
    {
      title: "Leave Requests",
      icon: <Clock className="w-12 h-12" />,
      color: "from-orange-500 to-red-500",
      route: "/manager/leave-requests"
    },
    {
      title: "Reports & Analytics",
      icon: <BarChart3 className="w-12 h-12" />,
      color: "from-green-500 to-teal-500",
      route: "/manager/reports"
    },
    {
      title: "My Profile",
      icon: <Users className="w-12 h-12" />,
      color: "from-indigo-500 to-blue-500",
      route: "/profile-dashboard"
    },
    {
      title: "Logout",
      icon: <LogOut className="w-12 h-12" />,
      color: "from-red-500 to-pink-500",
      action: handleLogout
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          IMPLOYEE
        </h1>
        <p className="text-xl mt-2">
          Welcome back, <span className="font-semibold">{userName}</span>
        </p>
        <p className="text-gray-400 text-sm">{currentDate}</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Employees" value="42" icon={<Users />} />
        <StatCard title="Present Today" value="38" icon={<CheckCircle />} />
        <StatCard title="Pending Requests" value="5" icon={<Clock />} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              card.action ? card.action() : navigate(card.route)
            }
            className={`bg-gradient-to-br ${card.color} rounded-2xl p-6 cursor-pointer shadow-xl`}
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold">{card.title}</h3>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-10 bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <ActivityItem
          icon={<CheckCircle className="text-green-400" />}
          text="Employee attendance marked"
          time="Today"
        />
        <ActivityItem
          icon={<Clock className="text-orange-400" />}
          text="Profile change request pending"
          time="2 hrs ago"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white/10 rounded-xl p-6 border border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-blue-400">{icon}</div>
      </div>
    </div>
  );
}

function ActivityItem({ icon, text, time }) {
  return (
    <div className="flex gap-3 p-3 bg-white/5 rounded-lg">
      {icon}
      <div>
        <p className="text-sm">{text}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}