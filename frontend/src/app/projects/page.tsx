'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { projectsData } from '@/lib/projects';


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

export default function ProjectsPage() {
  return (
    <main className="min-h-screen transition-colors duration-300 bg-slate-950 text-slate-100">
      <Navbar />

      <div className="max-w-6xl px-4 py-20 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl text-slate-100">
            All Projects
          </h1>
          <p className="text-lg text-gray-300">
            A collection of projects showcasing what I’ve built and learned.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8"
        >
          {projectsData.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="p-6 overflow-hidden glass-card sm:p-8 rounded-2xl"
            >
              <div className="grid gap-6 md:grid-cols-3">
                {/* Cover */}
                <div className="relative h-48 overflow-hidden sm:h-64 rounded-xl md:col-span-1">
                  <Image
                    src={project.cover}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                  />
                </div>


                {/* Content */}
                <div className="flex flex-col justify-between md:col-span-2">
                  <div>
                    <div className="flex items-start justify-between gap-4 mt-6 mb-6">
                      <h2 className="text-2xl font-bold sm:text-3xl text-slate-100">
                        {project.title}
                      </h2>
                      <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${project.statusColor}`}>
                        {project.status}
                      </span>
                    </div>

                    <p className="mb-4 text-base text-gray-300">
                      {project.longDescription}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <h3 className="mb-3 font-semibold text-slate-100">Key Features:</h3>
                      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {project.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="mt-1 text-blue-400">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-3 py-1 text-xs font-medium border rounded-full border-white/10 bg-white/5 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    <Link href={`/projects/${project.id}`}>
                      <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 transition-colors border rounded-lg border-blue-500/50 bg-blue-500/10 hover:bg-white/10">
                        <ArrowRight size={16} />
                        View Details
                      </button>
                    </Link>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                      >
                        <ExternalLink size={16} />
                        Demo
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border rounded-lg border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                      >
                        <Github size={16} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
