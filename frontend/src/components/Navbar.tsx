'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';

const menuItems = [
  { label: 'Projects', href: '/projects' },
  { label: 'Blogs', href: '/blogs' },
] as const;

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = useCallback(() => {
    setMobileOpen(false);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-slate-950/80 backdrop-blur-xl'
          : 'bg-slate-950'
      }`}
    >
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer group"
          >
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10 overflow-hidden border-2 rounded-lg shadow-lg border-white-500">
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={pathname === '/' ? { opacity: 0, x: -15 } : { opacity: 1, x: 0, transition: { delay: 0.2 } }}
                whileHover={pathname !== '/' ? { x: -8, scale: 1.2 } : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="hidden sm:block"
              >
                <motion.div
                  animate={pathname !== '/' ? { x: [0, -4, 0] } : undefined}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowLeft size={20} className="text-blue-400 transition-colors drop-shadow-lg group-hover:text-blue-300" />
                </motion.div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Menu Items - Desktop */}
          <div className="hidden gap-8 md:flex" role="navigation" aria-label="Main navigation">
            {menuItems.map((item, idx) => {
              const isActive = pathname === item.href;
              return (
                <motion.div 
                  key={item.href} 
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded ${
                      isActive
                        ? 'text-blue-400'
                        : 'text-slate-300 hover:text-blue-400'
                    }`}
                    aria-label={`Go to ${item.label}`}
                  >
                    {item.label}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-400 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <SearchBar />

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 transition-colors rounded-lg md:hidden hover:bg-white/10"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-slate-100" />
              ) : (
                <Menu className="w-5 h-5 text-slate-100" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-white/10 md:hidden"
              role="navigation"
              aria-label="Mobile navigation menu"
            >
              <div className="flex flex-col gap-2 py-4">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Link
                        href={item.href}
                        className={`block px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded ${
                          isActive
                            ? 'text-blue-400 bg-blue-500/10'
                            : 'text-slate-300 hover:text-blue-400'
                        }`}
                        onClick={handleNavClick}
                        aria-label={`Go to ${item.label}`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default memo(Navbar);
