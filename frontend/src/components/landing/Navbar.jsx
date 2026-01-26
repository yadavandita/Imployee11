import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#testimonials', label: 'Testimonials' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-700/40 bg-slate-900/80 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
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

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <RouterLink
            to="/login"
            className="text-sm text-slate-400 transition-colors hover:text-white px-4 py-2"
          >
            Sign In
          </RouterLink>
          <RouterLink
            to="/signup"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Get Started
          </RouterLink>
        </div>

        <button
          type="button"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <Menu className="h-6 w-6 text-white" />
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-slate-700/40 bg-slate-900/95 backdrop-blur-xl lg:hidden"
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 transition-colors hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-700/40">
              <RouterLink
                to="/login"
                className="w-full text-center text-sm text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </RouterLink>
              <RouterLink
                to="/signup"
                className="w-full text-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 px-4 py-2 rounded-lg text-sm font-medium"
              >
                Get Started
              </RouterLink>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
