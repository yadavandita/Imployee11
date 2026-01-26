import { motion } from 'framer-motion';
import { TrendingUp, Users, MapPin, Clock, MessageSquare, Settings, Search, Bell, ChevronDown } from 'lucide-react';

export function DashboardPreview() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Powerful Dashboard
            </span>
            {' '}at Your Fingertips
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Real-time insights, employee metrics, and AI-powered analytics all in one unified interface
          </p>
        </motion.div>

        {/* Floating dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900 shadow-2xl">
            {/* Browser Chrome */}
            <div className="flex items-center justify-between border-b border-slate-700/50 bg-slate-800/80 px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex flex-1 justify-center">
                <div className="flex items-center gap-2 rounded-md bg-slate-700/50 px-3 py-1">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-400">app.imployee.io/dashboard</span>
                </div>
              </div>
              <div className="w-16" />
            </div>
            
            {/* Dashboard Content */}
            <div className="flex">
              {/* Sidebar */}
              <div className="hidden w-48 border-r border-slate-700/50 bg-slate-800/40 p-3 md:block">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
                    <span className="text-xs font-bold text-white">IM</span>
                  </div>
                  <span className="text-sm font-semibold text-white">IMPLOYEE</span>
                </div>
                
                <nav className="space-y-1">
                  {[
                    { icon: TrendingUp, label: 'Dashboard', active: true },
                    { icon: Users, label: 'Employees', active: false },
                    { icon: MapPin, label: 'Geofence', active: false },
                    { icon: Clock, label: 'Attendance', active: false },
                    { icon: MessageSquare, label: 'HR Bot', active: false },
                    { icon: Settings, label: 'Settings', active: false },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors ${
                          item.active
                            ? 'bg-cyan-500/20 text-cyan-400'
                            : 'text-slate-400 hover:bg-slate-700/50'
                        }`}
                      >
                        <IconComponent className="h-3.5 w-3.5" />
                        {item.label}
                      </div>
                    );
                  })}
                </nav>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 p-4">
                {/* Top Bar */}
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Good morning, Admin</h3>
                    <p className="text-xs text-slate-500">Monday, Jan 27, 2025</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1">
                      <Search className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-500">Search...</span>
                    </div>
                    <div className="relative">
                      <Bell className="h-4 w-4 text-slate-400" />
                      <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500" />
                    </div>
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { label: 'Total Employees', value: '1,247', change: '+12', icon: Users, color: 'cyan' },
                    { label: 'Present Today', value: '1,189', change: '95.3%', icon: MapPin, color: 'green' },
                    { label: 'On Leave', value: '43', change: '3.4%', icon: Clock, color: 'yellow' },
                    { label: 'Bot Queries', value: '89', change: '+23', icon: MessageSquare, color: 'purple' },
                  ].map((stat) => {
                    const IconComponent = stat.icon;
                    const colorClass = {
                      cyan: 'text-cyan-400',
                      green: 'text-green-400',
                      yellow: 'text-yellow-400',
                      purple: 'text-purple-400',
                    }[stat.color];
                    
                    return (
                      <div key={stat.label} className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <IconComponent className={`h-4 w-4 ${colorClass}`} />
                          <span className={`text-[10px] ${colorClass}`}>{stat.change}</span>
                        </div>
                        <p className="text-lg font-bold text-white">{stat.value}</p>
                        <p className="text-[10px] text-slate-500">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
                
                {/* Charts Row */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {/* Time Respect Index Chart */}
                  <div className="md:col-span-2 rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                    <div className="mb-3 flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
                      <div>
                        <p className="text-xs font-medium text-white">Time Respect Index</p>
                        <p className="text-[10px] text-slate-500">Weekly performance score</p>
                      </div>
                      <div className="flex items-center gap-1 rounded bg-slate-700/50 px-2 py-0.5 text-[10px] text-slate-400">
                        This Week <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                    <div className="flex h-24 items-end gap-1">
                      {[
                        { day: 'Mon', value: 85, color: 'from-cyan-500 to-cyan-400' },
                        { day: 'Tue', value: 92, color: 'from-cyan-500 to-blue-500' },
                        { day: 'Wed', value: 78, color: 'from-yellow-500 to-orange-500' },
                        { day: 'Thu', value: 95, color: 'from-green-500 to-emerald-400' },
                        { day: 'Fri', value: 88, color: 'from-cyan-500 to-blue-500' },
                        { day: 'Sat', value: 91, color: 'from-cyan-500 to-blue-500' },
                        { day: 'Sun', value: 87, color: 'from-cyan-500 to-blue-500' },
                      ].map((item) => (
                        <div key={item.day} className="flex flex-1 flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t bg-gradient-to-t ${item.color}`}
                            style={{ height: `${item.value * 0.9}px` }}
                          />
                          <span className="text-[9px] text-slate-500">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Silent Signals */}
                  <div className="rounded-lg border border-slate-700/50 bg-slate-800/50 p-3">
                    <p className="mb-2 text-xs font-medium text-white">Silent Signals</p>
                    <div className="space-y-2">
                      {[
                        { label: 'Team Morale', value: 87, status: 'healthy' },
                        { label: 'Workload Balance', value: 72, status: 'warning' },
                        { label: 'Engagement', value: 94, status: 'healthy' },
                      ].map((signal) => (
                        <div key={signal.label}>
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">{signal.label}</span>
                            <span
                              className={`text-[10px] ${
                                signal.status === 'healthy' ? 'text-green-400' : 'text-yellow-400'
                              }`}
                            >
                              {signal.value}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                            <div
                              className={`h-full rounded-full ${
                                signal.status === 'healthy'
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                                  : 'bg-gradient-to-r from-yellow-500 to-orange-400'
                              }`}
                              style={{ width: `${signal.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 rounded-md bg-green-500/10 px-2 py-1">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                      <span className="text-[10px] text-green-400">All metrics within range</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
