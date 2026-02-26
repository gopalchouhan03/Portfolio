'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLoading } from '@/context/LoadingContext';

const LoadingScreen = () => {
  const { isFirstLoad, setIsFirstLoad } = useLoading();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!isFirstLoad) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      // mark that the loading animation has completed for this session
      try {
        setIsFirstLoad(false);
      } catch (e) {
        // noop
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [isFirstLoad, setIsFirstLoad]);

  // detect small screens and reduce animation intensity for performance
  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isVisible) return null;

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

  const text = 'GOPAL CHOUHAN';

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={isMobile ? { scale: [1, 1.04, 1] } : {
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: isMobile ? 6 : 8,
            repeat: isMobile ? 0 : Infinity,
            ease: 'easeInOut',
          }}
          className={isMobile ? "absolute rounded-full -top-24 -right-8 h-40 w-40 bg-gradient-to-br from-blue-500/20 to-purple-500/10 blur-2xl" : "absolute rounded-full -top-40 -right-40 h-80 w-80 bg-gradient-to-br from-blue-500/30 to-purple-500/20 blur-3xl"}
        />
        <motion.div
          animate={isMobile ? { scale: [1, 1.04, 1] } : {
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: isMobile ? 6 : 8,
            repeat: isMobile ? 0 : Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
          className={isMobile ? "absolute rounded-full -bottom-24 -left-8 h-40 w-40 bg-gradient-to-tr from-pink-500/20 to-purple-500/10 blur-2xl" : "absolute rounded-full -bottom-40 -left-40 h-80 w-80 bg-gradient-to-tr from-pink-500/30 to-purple-500/20 blur-3xl"}
        />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center gap-8"
      >
        {/* Animated orbs */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
            />
          ))}
        </motion.div>

        {/* Animated text */}
        <div className="flex justify-center overflow-hidden">
          {text.split('').map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              className="text-3xl font-bold tracking-widest sm:text-4xl lg:text-5xl"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #a855f7, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-sm font-medium tracking-widest text-center text-gray-400 uppercase"
        >
          Full Stack Developer
        </motion.p>

        {/* Advanced progress bar */}
        <motion.div
          variants={itemVariants}
          className={isMobile ? 'w-40 h-1 mt-6 overflow-hidden rounded-full bg-white/10' : 'w-64 h-1 mt-8 overflow-hidden rounded-full bg-white/10'}
        >
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: isMobile ? 2.4 : 3,
              ease: 'easeInOut',
            }}
            className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          />
        </motion.div>

        {/* Animated shimmer line */}
        <motion.div
          variants={itemVariants}
          className={isMobile ? 'w-24 h-px mt-5 overflow-hidden bg-gradient-to-r from-transparent via-blue-400 to-transparent' : 'w-32 h-px mt-6 overflow-hidden bg-gradient-to-r from-transparent via-blue-400 to-transparent'}
        >
          <motion.div
            animate={{ x: [-100, 100] }}
            transition={{
              duration: isMobile ? 2.4 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent blur-sm"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
