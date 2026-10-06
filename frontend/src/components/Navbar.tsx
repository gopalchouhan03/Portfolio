'use client';

import { useState, useEffect, memo } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
                whileHover={pathname !== '/' ? { x: -8, scale: 1.12 } : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="block"
              >
                  <motion.div
                    animate={pathname !== '/' ? { x: [0, -4, 0] } : undefined}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowLeft className="w-4 h-4 text-blue-400 transition-colors sm:w-5 sm:h-5 drop-shadow-lg group-hover:text-blue-300" />
                  </motion.div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <SearchBar />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default memo(Navbar);
