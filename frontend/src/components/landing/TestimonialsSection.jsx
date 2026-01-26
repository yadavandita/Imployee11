import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      "IMPLOYEE's geofence attendance eliminated our time theft problem completely. We save over $50,000 annually.",
    author: 'Ayushman Singh',
    rating: 5,
  },
  {
    quote:
      'The AI HR Bot handles 80% of our employee queries automatically. Our HR team can finally focus on strategic work.',
    author: 'Zahid Gazi',
    rating: 5,
  },
  {
    quote:
      'Silent Signals Dashboard helped us identify and prevent burnout in our engineering team. Game changer.',
    author: 'Prachi Hindlekar',
    rating: 5,
  },
];

const logos = ['TechFlow', 'InnovateCorp', 'CloudScale', 'DataPrime', 'NexGen', 'Quantum'];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="testimonials" className="relative bg-slate-950 py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500/5 to-blue-500/5 blur-3xl" />
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
            Trusted by Leaders
          </span>
          <h2 className="mt-6 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Loved by{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              HR Teams Worldwide
            </span>
          </h2>
        </motion.div>

        {/* Testimonial cards */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 blur transition-opacity duration-500 group-hover:opacity-30" />
              <div className="relative flex h-full flex-col rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 text-white">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-lg font-bold text-white">
                    {testimonial.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logo cloud */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          <p className="text-center text-sm text-slate-400">Trusted by 500+ companies worldwide</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 lg:gap-12">
            {logos.map((logo) => (
              <div
                key={logo}
                className="text-xl font-bold text-slate-500 transition-colors hover:text-slate-400"
              >
                {logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
