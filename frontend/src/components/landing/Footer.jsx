import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Integrations', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Status', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <footer className="relative border-t border-slate-700/40 bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid gap-8 lg:grid-cols-6"
        >
          {/* Brand */}
          <div className="lg:col-span-2">
            <RouterLink to="/" className="flex items-center gap-2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 opacity-75 blur" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-xl font-bold text-transparent">
                    IM
                  </span>
                </div>
              </div>
              <span className="text-xl font-bold text-white">IMPLOYEE</span>
            </RouterLink>
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              AI-powered HR solutions for the modern workplace. Transform how you manage your
              most valuable asset—your people.
            </p>
            <div className="mt-6 flex gap-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  <span className="sr-only">{social}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/50 text-xs transition-colors hover:bg-slate-800">
                    {social[0]}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white">{category}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-700/40 pt-8 sm:flex-row"
        >
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} IMPLOYEE. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Made with{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-medium">
              AI
            </span>{' '}
            for humans
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
