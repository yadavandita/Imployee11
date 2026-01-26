import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { UserPlus, Settings, Rocket, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up in seconds with your company email. No credit card required to start.',
    step: '01',
  },
  {
    icon: Settings,
    title: 'Configure Your Workspace',
    description: 'Set up geofences, HR policies, and customize your AI bot responses.',
    step: '02',
  },
  {
    icon: Rocket,
    title: 'Onboard Your Team',
    description: 'Invite employees, assign roles, and let them download the mobile app.',
    step: '03',
  },
  {
    icon: BarChart3,
    title: 'Track & Optimize',
    description: 'Monitor attendance, analyze signals, and continuously improve workplace culture.',
    step: '04',
  },
];

export function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-blue-950 py-24 lg:py-32">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="inline-block rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm text-purple-400">
            Simple Setup
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Get Started in{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Four Easy Steps
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-slate-300">
            From signup to fully operational in less than a day. Our streamlined onboarding
            process gets you up and running fast.
          </p>
        </motion.div>

        <div className="relative mt-16">
          {/* Connection line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-pink-500/50 lg:block" />

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`relative flex gap-6 ${index % 2 === 1 ? 'lg:flex-row-reverse lg:text-right' : ''}`}
                >
                  {/* Step number circle on the timeline */}
                  <div className="hidden lg:block">
                    <div
                      className={`absolute top-0 ${
                        index % 2 === 0
                          ? 'right-0 translate-x-1/2 lg:right-auto lg:left-1/2 lg:-translate-x-1/2'
                          : 'left-0 -translate-x-1/2 lg:left-1/2'
                      }`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 text-sm font-bold text-white shadow-lg shadow-cyan-500/30">
                        {step.step}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 lg:hidden">
                      <span className="text-lg font-bold text-cyan-400">{step.step}</span>
                    </div>
                    <div className={`flex-1 ${index % 2 === 1 ? 'lg:pr-20' : 'lg:pl-20'}`}>
                      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
                        <Icon className="h-6 w-6 text-cyan-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      <p className="mt-2 text-slate-400">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
