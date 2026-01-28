'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Play, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { projectsData } from '@/lib/projects';
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiPostgresql,
  SiMongodb,
  SiTailwindcss,
  SiDocker,
  SiFirebase,
  SiExpress,
  SiNextdotjs,
  SiSupabase,
} from 'react-icons/si';

/* icon maps unchanged */
const techIconMap: Record<string, any> = {
  'Next.js': SiNextdotjs,
  'Node.js': SiNodedotjs,
  'React Native': SiReact,
  'Firebase': SiFirebase,
  'Express': SiExpress,
  'TypeScript': SiTypescript,
  'PostgreSQL': SiPostgresql,
  'WebSocket': SiNodedotjs,
  'ML': SiNodedotjs,
  'Supabase': SiSupabase,
  'OpenAI': SiNodedotjs,
  'Tailwind': SiTailwindcss,
  'React': SiReact,
  'JavaScript': SiJavascript,
  'MongoDB': SiMongodb,
  'Docker': SiDocker,
};

const techColorMap: Record<string, string> = {
  'Next.js': '#000000',
  'Node.js': '#68a063',
  'React': '#61dafb',
  'Express': '#000000',
  'TypeScript': '#3178c6',
  'MongoDB': '#00ed64',
  'Tailwind': '#06b6d4',
  'WebSocket': '#68a063',
};

export default function ProjectsSection() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  return (
    <section className="relative px-4 py-16 sm:py-28" aria-label="Projects section">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-2 text-sm font-semibold tracking-widest text-blue-400 uppercase">
            Featured
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">Projects</h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 mb-12 md:grid-cols-2"
        >
          {projectsData.slice(0, 4).map((project) => (
            <motion.article
              key={project.id}
              whileHover={{ y: -8 }}
              className="relative flex flex-col overflow-hidden rounded-xl glass-card group"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden sm:h-64 rounded-t-xl">
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  className="object-cover"
                />

                {/* Overlay */}
                {/* Blur & Play Button Overlay */}
                <motion.div
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={
                    hoveredProject === project.id
                      ? { opacity: 1, backdropFilter: 'blur(6px)' }
                      : { opacity: 0, backdropFilter: 'blur(0px)' }
                  }
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30"
                >
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={
                      hoveredProject === project.id
                        ? { scale: 1, opacity: 1 }
                        : { scale: 0.7, opacity: 0 }
                    }
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex items-center justify-center rounded-full shadow-xl w-14 h-14 bg-white/90 backdrop-blur-md"
                  >
                    <Play className="w-6 h-6 text-black fill-black ml-[2px]" />
                  </motion.div>
                </motion.div>

              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <span className={`px-3 py-1 text-xs rounded-full ${project.statusColor}`}>
                    {project.status}
                  </span>
                </div>

                <p className="mb-4 text-sm text-gray-400">
                  {project.description}
                </p>

                {/* Tech */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {project.tags.map((tag) => {
                    const Icon = techIconMap[tag];
                    return (
                      <div key={tag}>
                        {Icon ? (
                          <Icon size={20} color={techColorMap[tag] || '#fff'} />
                        ) : (
                          <span className="text-xs">{tag}</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Links */}
                <div className="flex gap-3 mt-auto">
                  <Link href={`/projects/${project.id}`} className="flex-1">
                    <button className="w-full btn-primary">
                      <ArrowRight size={16} />
                      Details
                    </button>
                  </Link>

                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-sm border rounded-lg"
                    >
                      <ExternalLink size={16} />
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link href="/projects">
            <button className="btn-primary">View All Projects</button>
          </Link>
        </div>

      </div>
    </section>
  );
}
