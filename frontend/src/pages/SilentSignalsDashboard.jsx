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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-purple-500/30 border-t-purple-500 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.03, 0.08, 0.03],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.1)_0%,_transparent_50%)]"
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-purple-500/10 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Silent Signals
              </h1>
              <p className="text-purple-300/70 text-sm">
                Team insights • Privacy-first • Pattern recognition • Aggregated data only
              </p>
            </motion.div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Team Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {/* Team Health */}
            <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-purple-300/70 text-sm uppercase tracking-wider mb-1">Team Health</p>
                  <h3 className="text-3xl font-bold">{healthScore}</h3>
                  <p className="text-xs text-purple-300/50 mt-2">out of 100</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart
                    size={48}
                    className={healthScore > 75 ? 'text-green-400' : healthScore > 50 ? 'text-yellow-400' : 'text-red-400'}
                    fill="currentColor"
                  />
                </motion.div>
              </div>
              <div className="h-2 bg-purple-500/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${healthScore > 75 ? 'bg-green-400' : healthScore > 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                />
              </div>
            </div>

            {/* Team Size */}
            <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-300/70 text-sm uppercase tracking-wider mb-1">Team Size</p>
                  <h3 className="text-3xl font-bold">{teamSize}</h3>
                  <p className="text-xs text-blue-300/50 mt-2">active members</p>
                </div>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity }}>
                  <Users size={48} className="text-blue-400" />
                </motion.div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-orange-500/40 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-orange-300/70 text-sm uppercase tracking-wider mb-1">Active Signals</p>
                  <h3 className="text-3xl font-bold">{alerts.length}</h3>
                  <p className="text-xs text-orange-300/50 mt-2">patterns detected</p>
                </div>
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <AlertCircle size={48} className="text-orange-400" />
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
              className="mb-12"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-400" />
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
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          alert.severity === 'critical'
                            ? 'bg-red-400'
                            : alert.severity === 'warning'
                            ? 'bg-yellow-400'
                            : 'bg-blue-400'
                        }`}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm mb-1">{alert.description}</h4>
                        <p className="text-xs text-gray-300/70">{alert.recommendation}</p>
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
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
              icon={<Activity size={20} className="text-emerald-400" />}
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
              icon={<MessageSquare size={20} className="text-violet-400" />}
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
              icon={<BarChart3 size={20} className="text-pink-400" />}
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
              icon={<Minus size={20} className="text-teal-400" />}
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
            className="bg-gradient-to-r from-purple-500/5 to-blue-500/5 border border-purple-500/10 rounded-lg p-4 text-sm text-gray-300/70"
          >
            <p className="mb-2 font-semibold text-gray-300">🔒 Privacy by Design</p>
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
    <TrendingUp size={16} className="text-green-400" />
  ) : trend === 'down' ? (
    <TrendingDown size={16} className="text-red-400" />
  ) : trend === 'warning' ? (
    <AlertCircle size={16} className="text-yellow-400" />
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
      className={`p-6 rounded-xl border backdrop-blur-sm cursor-pointer transition-all ${
        isSelected
          ? 'bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30'
          : 'bg-slate-800/40 border-slate-700/30 hover:bg-slate-800/60 hover:border-slate-600/50'
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
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 pt-4 border-t border-purple-500/20 space-y-2"
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
