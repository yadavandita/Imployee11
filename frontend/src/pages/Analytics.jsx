import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API from '../api/api';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalEmployees: 0,
    attendanceRate: 0,
    departmentData: [],
    monthlyAttendance: [],
    payrollMetrics: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setAnalyticsData({
        totalEmployees: 124,
        attendanceRate: 94.5,
        departmentData: [
          { name: 'Engineering', value: 45 },
          { name: 'Sales', value: 32 },
          { name: 'HR', value: 18 },
          { name: 'Operations', value: 29 }
        ],
        monthlyAttendance: [
          { month: 'Jan', attendance: 92 },
          { month: 'Feb', attendance: 95 },
          { month: 'Mar', attendance: 91 },
          { month: 'Apr', attendance: 96 },
          { month: 'May', attendance: 93 },
          { month: 'Jun', attendance: 94 }
        ],
        payrollMetrics: {
          totalPayroll: '₹24,50,000',
          activePayruns: 3,
          pendingApprovals: 2
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-500 border-t-pink-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-slate-400 text-lg">Real-time insights into your workforce</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <motion.div
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.2)' }}
            className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-6 border border-indigo-500/20 backdrop-blur-sm"
          >
            <p className="text-indigo-200 text-sm font-medium mb-2">Total Employees</p>
            <p className="text-4xl font-bold text-white">{analyticsData.totalEmployees}</p>
            <p className="text-indigo-300 text-xs mt-3">↑ 5 this month</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.2)' }}
            className="bg-gradient-to-br from-pink-600 to-pink-800 rounded-xl p-6 border border-pink-500/20 backdrop-blur-sm"
          >
            <p className="text-pink-200 text-sm font-medium mb-2">Attendance Rate</p>
            <p className="text-4xl font-bold text-white">{analyticsData.attendanceRate}%</p>
            <p className="text-pink-300 text-xs mt-3">↑ 2.3% vs last month</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(245, 158, 11, 0.2)' }}
            className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-xl p-6 border border-amber-500/20 backdrop-blur-sm"
          >
            <p className="text-amber-200 text-sm font-medium mb-2">Active Payrolls</p>
            <p className="text-4xl font-bold text-white">{analyticsData.payrollMetrics.activePayruns}</p>
            <p className="text-amber-300 text-xs mt-3">{analyticsData.payrollMetrics.pendingApprovals} pending</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)' }}
            className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl p-6 border border-emerald-500/20 backdrop-blur-sm"
          >
            <p className="text-emerald-200 text-sm font-medium mb-2">Total Payroll</p>
            <p className="text-3xl font-bold text-white">{analyticsData.payrollMetrics.totalPayroll}</p>
            <p className="text-emerald-300 text-xs mt-3">This month</p>
          </motion.div>
        </motion.div>

        {/* Charts Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Attendance Chart */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50"
          >
            <h2 className="text-xl font-bold text-white mb-6">Monthly Attendance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.monthlyAttendance}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#404854" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Department Distribution */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50"
          >
            <h2 className="text-xl font-bold text-white mb-6">Department Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#e2e8f0'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Detailed Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Department Breakdown</h3>
            <div className="space-y-4">
              {analyticsData.departmentData.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    />
                    <span className="text-slate-300">{dept.name}</span>
                  </div>
                  <span className="font-bold text-white">{dept.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm">On-Time Rate</p>
                <p className="text-2xl font-bold text-emerald-400">98.2%</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Late Arrivals</p>
                <p className="text-2xl font-bold text-amber-400">8</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Absences</p>
                <p className="text-2xl font-bold text-rose-400">6</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50"
          >
            <h3 className="text-lg font-semibold text-white mb-6">Year-to-Date</h3>
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Total Hours Worked</p>
                <p className="text-2xl font-bold text-indigo-400">12,450h</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Avg Hours/Day</p>
                <p className="text-2xl font-bold text-pink-400">8.2h</p>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-slate-400 text-sm">Productivity Score</p>
                <p className="text-2xl font-bold text-amber-400">92/100</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
