'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { blogsData } from '@/lib/blogs';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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

export default function BlogsPage() {
  const blogs = blogsData;
  return (
    <main className="min-h-screen transition-colors duration-300 bg-slate-950 text-slate-100">
      <Navbar />

      <div className="max-w-4xl px-4 py-20 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl text-slate-100">
            Blog Articles
          </h1>
          <p className="text-lg text-gray-300">
            Thoughts on design, development, and technology
          </p>
        </motion.div>

        {/* Blogs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8"
        >
          {blogs.map((blog) => (
            <motion.article
              key={blog.id}
              variants={itemVariants}
              className="p-6 overflow-hidden transition-shadow duration-300 cursor-pointer glass-card sm:p-8 rounded-2xl hover:shadow-lg"
            >
              <div className="grid gap-6 md:grid-cols-4">
                {/* Cover */}
                <div
                  className="h-48 transition-transform duration-300 sm:h-52 rounded-xl md:col-span-1"
                >
                  <img
                    src={blog.cover}
                    alt={blog.title}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between md:col-span-3">
                  <div>
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-300">
                      <span className="inline-block px-3 py-1 text-xs font-medium text-blue-400 bg-blue-800/40 rounded-full">
                        {blog.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {blog.date}
                      </div>
                      <span>{blog.readTime}</span>
                    </div>

                    {/* Title & Description */}
                    <h2 className="mb-3 text-2xl font-bold sm:text-3xl text-slate-100">
                      {blog.title}
                    </h2>
                    <p className="mb-4 text-gray-300 line-clamp-3">
                      {blog.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-3 py-1 text-xs font-medium border rounded-full border-white/10 bg-white/5 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="flex items-center gap-2 mt-6 font-semibold text-blue-400 transition-all duration-300 group hover:gap-3"
                  >
                    Read Article
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <Footer />
    </main>
  );
}
