'use client';

import { motion } from 'framer-motion';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, ExternalLink, Github, ArrowRight, Heart, Share2 } from 'lucide-react';
import { projectsData } from '@/lib/projects';
import { useState, useEffect } from 'react';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = use(params);
  const project = projectsData.find((p) => p.id === parseInt(id));
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const projectIndex = projectsData.findIndex((p) => p.id === parseInt(id));

  // Load like state from localStorage on mount
  useEffect(() => {
    if (!id) return;
    const storageLiked = localStorage.getItem(`project-liked-${id}`);
    const storageCount = localStorage.getItem(`project-likes-${id}`);
    setLiked(storageLiked === 'true');
    setLikeCount(storageCount ? parseInt(storageCount) : 0);
  }, [id]);
  const prevProject = projectIndex > 0 ? projectsData[projectIndex - 1] : null;
  const nextProject = projectIndex < projectsData.length - 1 ? projectsData[projectIndex + 1] : null;
  const relatedProjects = projectsData.filter((p) =>
    project?.relatedProjectIds.includes(p.id)
  );

  if (!project) {
    return (
      <main className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="max-w-6xl px-4 py-20 mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Project not found
          </h1>
          <Link href="/projects">
            <button className="mt-8 btn-primary">Back to Projects</button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <article className="max-w-4xl px-4 py-20 mx-auto sm:px-6 lg:px-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Cover Image */}
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

          {/* Title & Status */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="mb-2 text-4xl font-bold sm:text-5xl text-slate-900 dark:text-slate-100">
                {project.title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-gray-400">
                {project.description}
              </p>
            </div>
            <span className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${project.statusColor}`}>
              {project.status}
            </span>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex gap-3 py-4 border-y border-slate-200 dark:border-white/10"
          >
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-blue-600 transition-colors border rounded-lg border-blue-500/50 bg-blue-500/10 dark:text-blue-400 hover:bg-blue-500/20"
              >
                <ExternalLink size={18} />
                View Demo
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition-colors border rounded-lg border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-white/10"
              >
                <Github size={18} />
                View Source Code
              </a>
            )}
          </motion.div>

          {/* Social Actions */}
          <div className="flex items-center gap-4 py-4 border-b border-slate-200 dark:border-white/10">
            <button
              onClick={() => {
                const newLiked = !liked;
                setLiked(newLiked);
                const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
                setLikeCount(newCount);
                localStorage.setItem(`project-liked-${id}`, newLiked.toString());
                localStorage.setItem(`project-likes-${id}`, newCount.toString());
              }}
              className="flex items-center gap-2 text-sm font-medium transition-colors text-slate-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <Heart size={18} fill={liked ? 'currentColor' : 'none'} color={liked ? 'currentColor' : undefined} />
              {liked ? 'Liked' : 'Like'} {likeCount > 0 && `(${likeCount})`}
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: project.title,
                    text: project.description,
                    url: window.location.href,
                  }).catch(() => {});
                } else {
                  // Fallback: copy to clipboard
                  navigator.clipboard.writeText(window.location.href);
                  alert('Project link copied to clipboard!');
                }
              }}
              className="flex items-center gap-2 text-sm font-medium transition-colors text-slate-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <Share2 size={18} />
              Share
            </button>
          </div>
        </motion.div>

        {/* Overview Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-6 mb-12 glass-card rounded-xl"
        >
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Overview
          </h2>
          <p className="text-base leading-relaxed text-slate-700 dark:text-gray-300">
            {project.overview}
          </p>
        </motion.section>

        {/* What Users Can Do */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            What Users Can Do
          </h2>
          <ul className="space-y-3">
            {project.whatUsersCan.map((item, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-lg glass-card"
              >
                <span className="flex-shrink-0 text-lg font-bold text-blue-500 dark:text-blue-400">
                  •
                </span>
                <span className="text-slate-700 dark:text-gray-300">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* Why I Built This */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Why I Built This
          </h2>
          <div className="space-y-3">
            {project.whyBuilt.map((reason, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 border border-blue-200 rounded-lg bg-blue-500/5 dark:bg-blue-500/10 dark:border-blue-500/20"
              >
                <span className="flex-shrink-0 font-semibold text-blue-600 dark:text-blue-400">
                  {idx + 1}.
                </span>
                <span className="text-slate-700 dark:text-gray-300">{reason}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="p-6 mb-12 glass-card rounded-xl"
        >
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {project.techStack.map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 p-3 border rounded-lg bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10"
              >
                <span className="text-blue-500 dark:text-blue-400">✓</span>
                <span className="text-slate-700 dark:text-gray-300">{tech}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Future Plans */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Future Plans
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {project.futureParams.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="p-4 border-l-4 border-blue-500 rounded-lg glass-card dark:border-blue-400"
              >
                <p className="text-slate-700 dark:text-gray-300">{plan}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid gap-4 mb-12 sm:grid-cols-2"
        >
          {prevProject ? (
            <Link href={`/projects/${prevProject.id}`}>
              <div className="p-6 transition-colors rounded-lg cursor-pointer glass-card hover:bg-slate-100 dark:hover:bg-white/10 group">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-600 dark:text-gray-400">
                  ← Previous Project
                </p>
                <h3 className="text-lg font-bold transition-colors text-slate-900 dark:text-slate-100 group-hover:text-blue-500">
                  {prevProject.title}
                </h3>
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextProject ? (
            <Link href={`/projects/${nextProject.id}`}>
              <div className="p-6 text-right transition-colors rounded-lg cursor-pointer glass-card hover:bg-slate-100 dark:hover:bg-white/10 group">
                <p className="mb-2 text-xs font-semibold uppercase text-slate-600 dark:text-gray-400">
                  Next Project →
                </p>
                <h3 className="text-lg font-bold transition-colors text-slate-900 dark:text-slate-100 group-hover:text-blue-500">
                  {nextProject.title}
                </h3>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </motion.div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Related Projects
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedProjects.map((relatedProject) => (
                <Link key={relatedProject.id} href={`/projects/${relatedProject.id}`}>
                  <div className="h-full p-6 transition-all cursor-pointer glass-card rounded-xl hover:ring-2 hover:ring-blue-500/50 group">
                    <div className="relative h-40 mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={relatedProject.cover}
                        alt={relatedProject.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-semibold transition-colors text-slate-900 dark:text-slate-100 group-hover:text-blue-500">
                        {relatedProject.title}
                      </h3>
                      <span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${relatedProject.statusColor}`}>
                        {relatedProject.status}
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-slate-600 dark:text-gray-400 line-clamp-2">
                      {relatedProject.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {relatedProject.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-2 py-1 text-xs font-medium rounded bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {relatedProject.tags.length > 2 && (
                        <span className="text-xs text-slate-600 dark:text-gray-400">
                          +{relatedProject.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </article>

      <Footer />
    </main>
  );
}
