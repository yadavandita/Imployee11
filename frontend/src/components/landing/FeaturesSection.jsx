import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  MapPin,
  Bot,
  FileText,
  Brain,
  Clock,
  Activity,
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Geofence Attendance',
    description:
      'Automatically track employee attendance using GPS-based geofencing. No more buddy punching or manual check-ins.',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    shadowColor: 'shadow-cyan-500/20',
  },
  {
    icon: Bot,
    title: 'AI HR Bot',
    description:
      '24/7 intelligent assistant for HR policy questions. Get instant, accurate responses about leave, benefits, and more.',
    gradient: 'from-purple-500 via-pink-500 to-red-500',
    shadowColor: 'shadow-purple-500/20',
  },
  {
    icon: FileText,
    title: 'Downloadable Payroll',
    description:
      'Generate comprehensive payslips in PDF format with detailed breakdowns of earnings, deductions, and taxes.',
    gradient: 'from-blue-500 via-cyan-500 to-teal-500',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    icon: Brain,
    title: 'Human Context Engine',
    description:
      'AI that understands your employees beyond data. Contextual insights for better decision making.',
    gradient: 'from-teal-500 via-green-500 to-emerald-500',
    shadowColor: 'shadow-teal-500/20',
  },
  {
    icon: Clock,
    title: 'Time Respect Index',
    description:
      'Measure and improve meeting culture. Track punctuality and respect for colleagues\' time.',
    gradient: 'from-green-500 via-emerald-500 to-teal-500',
    shadowColor: 'shadow-green-500/20',
  },
  {
    icon: Activity,
    title: 'Silent Signals Dashboard',
    description:
      'Detect early warning signs of burnout, disengagement, or team friction before they become problems.',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    shadowColor: 'shadow-emerald-500/20',
  },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative bg-slate-950 py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-sm text-cyan-400">
            Powerful Features
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Empower Your Team
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-slate-400">
            From smart attendance tracking to AI-powered insights, IMPLOYEE brings cutting-edge
            technology to human resources management.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 blur transition-opacity duration-500 group-hover:opacity-40`} />
                <div className="relative flex flex-col rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm h-full hover:bg-slate-800/70 transition-colors">
                  {/* Icon */}
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r ${feature.gradient} bg-opacity-10 mb-4`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-slate-400 flex-1">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
