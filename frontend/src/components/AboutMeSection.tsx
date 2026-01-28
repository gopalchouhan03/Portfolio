'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import {
  SiReact,
  SiNodedotjs,
  SiJavascript,
  SiPostgresql,
  SiMongodb,
  SiTailwindcss,
  SiDocker,
  SiExpress
} from 'react-icons/si';

const skills = [
  { id: 1, name: 'React', Icon: SiReact, color: '#61dafb' },
  { id: 2, name: 'Node.js', Icon: SiNodedotjs, color: '#68a063' },
  { id: 3, name: 'Express.js', Icon: SiExpress, color: '#3178c6' },
  { id: 4, name: 'JavaScript', Icon: SiJavascript, color: '#f7df1e' },
  { id: 5, name: 'PostgreSQL', Icon: SiPostgresql, color: '#336791' },
  { id: 6, name: 'MongoDB', Icon: SiMongodb, color: '#00ed64' },
  { id: 7, name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06b6d4' },
  { id: 8, name: 'Docker', Icon: SiDocker, color: '#2496ed' },
];

export default function AboutMeSection() {
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);

  return (
    <section className="relative px-4 py-16 sm:py-28" aria-label="About me section">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase">
            About
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">Me</h2>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-64 h-64 overflow-hidden shadow-2xl rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #facc15 0%, #fbbf24 100%)',
              }}
            >
              <Image
                src="/Logo.png"
                alt="Gopal Chouhan"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>

          {/* About Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <div>
              <h3 className="mb-4 text-2xl font-bold sm:text-3xl">
                Gopal Chouhan
              </h3>
              <p className="leading-relaxed text-gray-400">
                I'm a Full Stack web developer and Open Source Contributor, I
                love building products to solve real-world problems. I'm
                specialized in building MVP's.
              </p>
            </div>

            {/* Skills Section */}
            <div>
              <h4 className="mb-4 text-lg font-semibold">Skills</h4>
              <div
                className="flex flex-wrap gap-4"
                role="list"
                aria-label="Skills"
              >
                {skills.map((skill) => {
                  const { Icon } = skill;
                  const isHovered = hoveredSkill === skill.id;

                  return (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: skill.id * 0.05 }}
                      viewport={{ once: true }}
                      className="relative"
                      role="listitem"
                    >
                      <motion.div
                        onMouseEnter={() => setHoveredSkill(skill.id)}
                        onMouseLeave={() => setHoveredSkill(null)}
                        whileHover={{ scale: 1.2, y: -5 }}
                        className="p-3 transition-colors border rounded-lg cursor-pointer bg-white/5 border-white/10 hover:border-white/20"
                        aria-label={skill.name}
                      >
                        <Icon
                          size={28}
                          style={{ color: skill.color }}
                          className="transition-transform"
                        />
                      </motion.div>

                      {/* Tooltip */}
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={
                          isHovered
                            ? { opacity: 1, y: -10 }
                            : { opacity: 0, y: 5 }
                        }
                        transition={{ duration: 0.2 }}
                        className="absolute px-3 py-1 mt-2 text-xs font-medium text-white transform -translate-x-1/2 border rounded-md pointer-events-none top-full left-1/2 bg-slate-900 whitespace-nowrap border-white/20"
                        role="tooltip"
                      >
                        {skill.name}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
