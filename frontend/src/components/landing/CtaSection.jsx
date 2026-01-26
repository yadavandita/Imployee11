import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative overflow-hidden bg-slate-950 py-24 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
          className="absolute left-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute right-1/4 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-purple-500/20 blur-3xl"
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Transform Your{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              HR Experience?
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-300">
            Join 500+ companies already using IMPLOYEE to build better workplaces. Start your
            free 14-day trial today.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <RouterLink
              to="/signup"
              className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-3 text-white font-medium rounded-lg transition-all hover:from-cyan-400 hover:to-blue-400 hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] flex items-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </RouterLink>
            <button
              className="border border-slate-600 bg-transparent text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 px-8 py-3 font-medium rounded-lg transition-all"
            >
              Schedule a Demo
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-6 text-sm text-slate-400"
          >
            No credit card required. Cancel anytime.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
