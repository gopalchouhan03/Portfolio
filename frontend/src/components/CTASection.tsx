'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative px-4 py-12 sm:py-20 flex items-center justify-center min-h-[50vh]" aria-label="Call to action section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-2xl p-12 text-center glass-card"
        role="complementary"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="inline-block mb-6"
          aria-hidden="true"
        >
          <MessageCircle className="w-12 h-12 text-blue-400" />
        </motion.div>

        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Hey, you scrolled this far, let&apos;s talk.
        </h2>

        <p className="mb-8 text-lg text-muted">
          I&apos;m always interested in hearing about new projects and opportunities.
        </p>

        <motion.a
          href="mailto:gopalchouhan0310@gmail.com"
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="text-lg btn-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-blue-400 inline-block"
          aria-label="Send me an email message"
        >
          Send me a message
        </motion.a>
      </motion.div>
    </section>
  );
}
