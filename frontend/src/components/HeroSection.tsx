'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Link as LinkIcon, Mail, Github, Linkedin, Twitter, Instagram, Pin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export default function HeroSection() {
  const [showImageModal, setShowImageModal] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com', color: 'text-blue-400' },
    { icon: Linkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/gopal-chouhan-0429b931a ', color: 'text-blue-600' },
    { icon: Github, label: 'GitHub', href: 'https://github.com/gopalchouhan03', color: 'text-gray-400' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/gk_rajput_03', color: 'text-pink-500' },
    { icon: Mail, label: 'Email', href: 'mailto:gopalchouhan0310@gmail.com', color: 'text-red-400' },
    { icon: Pin, label: 'Portfolio', href: 'https://example.com', color: 'text-purple-400' },
  ];

  const handleLogoClick = () => {
    setShowImageModal(true);
  };
  return (
    <>
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 pt-6 pb-24">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, 30, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute rounded-full -top-40 -right-40 h-80 w-80 bg-blue-500/20 blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
            className="absolute rounded-full -bottom-40 -left-40 h-80 w-80 bg-purple-500/20 blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-3xl text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              variants={itemVariants}
              className="mb-4"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotateZ: 5 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
                onClick={handleLogoClick}
              >
                <div className="flex items-center gap-2">
                  <div className="relative overflow-hidden transition-colors duration-300 border-2 border-blue-500 rounded-lg shadow-lg h-18 w-18 hover:border-purple-500">
                    <Image
                      src="/Logo.png"
                      alt="Logo"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mb-4 text-sm font-semibold tracking-widest text-blue-400 uppercase"
            >
              Welcome to my portfolio
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="mb-6 text-4xl font-bold leading-tight sm:text-4xl lg:text-5xl"
            >
              Hi, I&apos;m <span className="gradient-text">Gopal</span> — A Full Stack
              <br />
              <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text">
                Web developer
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed text-muted"
            >
              I build clean, scalable web applications with modern <span className="font-semibold text-foreground">JavaScript</span>,{' '}
              <span className="font-semibold text-foreground">React</span>, and{' '}
              <span className="font-semibold text-foreground">and</span> backend systems{' '}
              <span className="font-semibold text-foreground">with</span> a strong curiosity{' '}
              <span className="font-semibold text-foreground">for AI and emerging technologies.</span>
            </motion.p>
                  
            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-center gap-4 sm:flex-row"
            >
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-blue-400"
                aria-label="Get in touch - contact for more information"
              >
                Get in touch
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="ml-2"
                >
                  →
                </motion.span>
              </motion.button>
              <motion.a
                href="/Gopal_Chouhan_Full_Stack_Developer_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255,255,255,0.4)' }}
                whileTap={{ scale: 0.95 }}
                className="inline-block text-center btn-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-blue-400"
                aria-label="Download or view my resume and CV"
              >
                Resume / CV
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Social Links Section */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-6 mt-12"
          >
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <motion.div
                  key={social.label}
                  className="relative"
                  onHoverStart={() => setHoveredSocial(social.label)}
                  onHoverEnd={() => setHoveredSocial(null)}
                >
                  <Link
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 hover:border-blue-400 transition-all duration-300 ${social.color} hover:scale-110`}
                    aria-label={social.label}
                  >
                    <IconComponent size={20} />
                  </Link>

                  {hoveredSocial === social.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: -35 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute px-2 py-1 text-xs font-medium text-white transform -translate-x-1/2 bg-gray-800 rounded pointer-events-none left-1/2 whitespace-nowrap"
                    >
                      {social.label}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Image Modal */}
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowImageModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <div className="relative overflow-hidden border-2 border-blue-500 rounded-lg shadow-2xl h-96 w-96">
                <Image
                  src="/Logo.png"
                  alt="Logo"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute text-white transition-colors top-4 right-4 hover:text-red-400"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </section>
    </>
  );
}
