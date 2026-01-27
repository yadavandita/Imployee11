import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/api';
import {
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Minus,
  Users,
  BarChart3,
  Activity,
  MessageSquare,
  Clock,
  Heart,
  Zap
} from 'lucide-react';

/**
 * Silent Signals Dashboard - Manager View
 * Updated with IMPLOYEE project color scheme
 * 
 * Displays team-level insights ONLY:
 * - No individual names or IDs
 * - Aggregated patterns and trends
 * - Actionable recommendations
 * - Privacy-first design
 */

export default function SilentSignalsDashboard() {
  const [teamSignals, setTeamSignals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);

  useEffect(() => {
    fetchTeamSignals();
    // Refresh every 30 minutes
    const interval = setInterval(fetchTeamSignals, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTeamSignals = async () => {
    try {
      setLoading(true);
      const response = await API.get('/signals/team');
      if (response.data.success) {
        setTeamSignals(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team signals');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md"
        >
          <p className="text-red-400">{error}</p>
        </motion.div>
      </div>
    );
  }

  if (!teamSignals) {
    return null;
  }

  const { metrics, alerts, teamSize, teamName } = teamSignals;
  const healthScore = metrics.teamHealthScore.score;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Animated background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.03, 0.08, 0.03],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-blue-500/10 backdrop-blur-md sticky top-0 z-20 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
                Silent Signals
              </h1>
              <p className="text-cyan-300/70 text-xs sm:text-sm">
                Team insights • Privacy-first • Pattern recognition • Aggregated data only
              </p>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Team Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            {/* Team Health */}
            <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-cyan-300/70 text-xs sm:text-sm uppercase tracking-wider mb-1">Team Health</p>
                  <h3 className="text-2xl sm:text-3xl font-bold">{healthScore}</h3>
                  <p className="text-xs text-cyan-300/50 mt-2">out of 100</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart
                    size={40}
                    className={`sm:w-12 sm:h-12 ${healthScore > 75 ? 'text-green-500' : healthScore > 50 ? 'text-amber-500' : 'text-red-500'}`}
                    fill="currentColor"
                  />
                </motion.div>
              </div>
              <div className="h-2 bg-blue-500/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${healthScore > 75 ? 'bg-green-500' : healthScore > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                />
              </div>
            </div>

            {/* Team Size */}
            <div className="bg-gradient-to-br from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-cyan-300/70 text-xs sm:text-sm uppercase tracking-wider mb-1">Team Size</p>
                  <h3 className="text-2xl sm:text-3xl font-bold">{teamSize}</h3>
                  <p className="text-xs text-cyan-300/50 mt-2">active members</p>
                </div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                  <Users size={40} className="sm:w-12 sm:h-12 text-cyan-400" />
                </motion.div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm hover:border-amber-500/40 transition-all sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-amber-300/70 text-xs sm:text-sm uppercase tracking-wider mb-1">Active Signals</p>
                  <h3 className="text-2xl sm:text-3xl font-bold">{alerts.length}</h3>
                  <p className="text-xs text-amber-300/50 mt-2">patterns detected</p>
                </div>
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <AlertCircle size={40} className="sm:w-12 sm:h-12 text-amber-400" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 sm:mb-12"
            >
              <h2 className="text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-amber-400" />
                Detected Patterns
              </h2>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className={`p-4 rounded-lg border backdrop-blur-sm ${
                      alert.severity === 'critical'
                        ? 'bg-red-500/10 border-red-500/30'
                        : alert.severity === 'warning'
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          alert.severity === 'critical'
                            ? 'bg-red-500'
                            : alert.severity === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{alert.description}</h4>
                        <p className="text-xs text-gray-400">{alert.recommendation}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12"
          >
            {/* Attendance Trend */}
            <MetricCard
              title="Attendance Pattern"
              icon={<Clock size={20} className="text-cyan-400" />}
              value={`${metrics.averageLoginTimeShift.value > 0 ? '+' : ''}${metrics.averageLoginTimeShift.value} min`}
              subtitle={`${metrics.averageLoginTimeShift.trendDirection === 'up' ? 'Shifted later' : 'Shifted earlier'} this month`}
              trend={metrics.averageLoginTimeShift.trendDirection}
              details={[
                { label: 'Previous average', value: `${metrics.averageLoginTimeShift.previousMonth} min from midnight` },
                { label: 'Status', value: 'Monitoring attendance consistency' }
              ]}
              isSelected={selectedMetric === 'attendance'}
              onClick={() => setSelectedMetric(selectedMetric === 'attendance' ? null : 'attendance')}
            />

            {/* Leave Clustering */}
            <MetricCard
              title="Leave Clustering"
              icon={<Activity size={20} className="text-teal-400" />}
              value={`${metrics.leaveClusteringScore.score}%`}
              subtitle={`${metrics.leaveClusteringScore.affectedCount}+ team members showing pattern`}
              trend={metrics.leaveClusteringScore.score > 40 ? 'warning' : 'stable'}
              details={[
                { label: 'Clustered days', value: metrics.leaveClusteringScore.clusteredDays },
                { label: 'Risk level', value: metrics.leaveClusteringScore.score > 70 ? 'High' : 'Moderate' }
              ]}
              isSelected={selectedMetric === 'leave'}
              onClick={() => setSelectedMetric(selectedMetric === 'leave' ? null : 'leave')}
            />

            {/* Communication Activity */}
            <MetricCard
              title="Communication Trend"
              icon={<MessageSquare size={20} className="text-blue-400" />}
              value={`${metrics.communicationTrend.activityChange > 0 ? '+' : ''}${metrics.communicationTrend.activityChange}%`}
              subtitle={`Currently: ${metrics.communicationTrend.currentLevel}`}
              trend={metrics.communicationTrend.activityChange > 0 ? 'up' : metrics.communicationTrend.activityChange < 0 ? 'down' : 'stable'}
              details={[
                { label: 'From', value: metrics.communicationTrend.previousLevel },
                { label: 'Change', value: `${Math.abs(metrics.communicationTrend.activityChange)}% ${metrics.communicationTrend.activityChange > 0 ? 'increase' : 'decrease'}` }
              ]}
              isSelected={selectedMetric === 'communication'}
              onClick={() => setSelectedMetric(selectedMetric === 'communication' ? null : 'communication')}
            />

            {/* Meeting Engagement */}
            <MetricCard
              title="Meeting Engagement"
              icon={<BarChart3 size={20} className="text-blue-400" />}
              value={`${metrics.meetingEngagement.acceptanceRate}%`}
              subtitle="Meeting acceptance rate"
              trend={metrics.meetingEngagement.change > 0 ? 'up' : metrics.meetingEngagement.change < 0 ? 'down' : 'stable'}
              details={[
                { label: 'Accept', value: `${metrics.meetingEngagement.acceptanceRate}%` },
                { label: 'Decline', value: `${metrics.meetingEngagement.declineRate}%` },
                { label: 'No response', value: `${metrics.meetingEngagement.noResponseRate}%` }
              ]}
              isSelected={selectedMetric === 'meeting'}
              onClick={() => setSelectedMetric(selectedMetric === 'meeting' ? null : 'meeting')}
            />

            {/* Attendance Variability */}
            <MetricCard
              title="Attendance Consistency"
              icon={<Minus size={20} className="text-cyan-400" />}
              value={`${metrics.attendanceVariability.coefficient.toFixed(1)} σ`}
              subtitle={`${metrics.attendanceVariability.isElevated ? 'Variability elevated' : 'Consistent'}`}
              trend={metrics.attendanceVariability.isElevated ? 'warning' : 'stable'}
              details={[
                { label: 'Change', value: `${metrics.attendanceVariability.change > 0 ? '+' : ''}${metrics.attendanceVariability.change}%` },
                { label: 'Status', value: metrics.attendanceVariability.isElevated ? 'Monitor closely' : 'Normal' }
              ]}
              isSelected={selectedMetric === 'variability'}
              onClick={() => setSelectedMetric(selectedMetric === 'variability' ? null : 'variability')}
            />

            {/* Team Signals */}
            <MetricCard
              title="Signal Overview"
              icon={<Zap size={20} className="text-amber-400" />}
              value={metrics.teamHealthScore.signals.length}
              subtitle="Active signal types"
              trend="info"
              details={
                metrics.teamHealthScore.signals.length > 0
                  ? metrics.teamHealthScore.signals.map((signal, idx) => ({
                    label: `Signal ${idx + 1}`,
                    value: signal
                  }))
                  : [{ label: 'Status', value: 'All systems normal' }]
              }
              isSelected={selectedMetric === 'signals'}
              onClick={() => setSelectedMetric(selectedMetric === 'signals' ? null : 'signals')}
            />
          </motion.div>

          {/* Privacy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border border-blue-500/20 rounded-lg p-4 text-sm text-gray-400"
          >
            <p className="mb-2 font-semibold text-cyan-300">🔒 Privacy by Design</p>
            <p>
              This dashboard shows team-level patterns and aggregated data only. No individual employee data is displayed.
              Insights are 2+ weeks old and use anonymized groupings. Use these signals for constructive team conversations, not performance metrics.
            </p>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

/**
 * Reusable metric card component
 */
function MetricCard({
  title,
  icon,
  value,
  subtitle,
  trend,
  details,
  isSelected,
  onClick
}) {
  const trendIcon = trend === 'up' ? (
    <TrendingUp size={16} className="text-green-500" />
  ) : trend === 'down' ? (
    <TrendingDown size={16} className="text-red-500" />
  ) : trend === 'warning' ? (
    <AlertCircle size={16} className="text-amber-500" />
  ) : (
    <Minus size={16} className="text-blue-400" />
  );

  return (
    <motion.div
      onClick={onClick}
      layoutId={`metric-${title}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-5 sm:p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-500/20 border-blue-500/50 ring-2 ring-blue-500/30'
          : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60 hover:border-blue-500/30'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-semibold text-sm text-gray-200">{title}</h3>
        </div>
        {trendIcon}
      </div>

      <div className="mb-3">
        <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-blue-500/20 space-y-2"
        >
          {details.map((detail, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-gray-400">{detail.label}</span>
              <span className="text-gray-200 font-medium">{detail.value}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}