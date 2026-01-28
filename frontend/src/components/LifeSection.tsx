'use client';

import { motion } from 'framer-motion';
import { Book, Film } from 'lucide-react';

const lifeItems = [
  {
    icon: Book,
    title: 'Books',
    description: 'Books that have influenced my thinking and growth.',
  },
  {
    icon: Film,
    title: 'Movies',
    description: 'Movies and shows that have inspired and entertained me.',
  },
];

export default function LifeSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="relative px-4 py-16 sm:py-28" aria-label="Personal life section">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-2">
            Personal
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold">Life</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 max-w-3xl"
          role="list"
        >
          {lifeItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
                className="glass-card p-6 cursor-pointer group focus-within:ring-2 focus-within:ring-purple-400 rounded-xl"
                role="listitem"
              >
                <div className="mb-4 inline-block rounded-lg bg-purple-500/20 p-3 group-hover:bg-purple-500/30 transition-colors">
                  <Icon className="h-6 w-6 text-purple-400" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
