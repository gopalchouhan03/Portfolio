'use client';

import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { blogsData } from '@/lib/blogs';

const blogs = blogsData.slice(0, 4);

export default function BlogsSection() {
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
    <section className="relative px-4 py-16 sm:py-28" aria-label="Blog articles section">
      <div className="mx-auto max-w-7xl">
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
          <h2 className="text-3xl font-bold sm:text-4xl">Blogs</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 mb-12 md:grid-cols-2"
          role="list"
        >
          {blogs.map((blog) => (
            <motion.article
              key={blog.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.2 },
              }}
              className="flex flex-col overflow-hidden glass-card group focus-within:ring-2 focus-within:ring-blue-400 rounded-xl"
              role="listitem"
            >
              {/* Blog Cover */}
              <div className="h-48 transition-transform duration-300 bg-gray-700 group-hover:scale-105 rounded-t-xl overflow-hidden">
                <img
                  src={blog.cover}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Blog Content */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="mb-3 text-xl font-semibold leading-tight">
                  {blog.title}
                </h3>

                <p className="flex-1 mb-4 text-sm leading-relaxed text-gray-400">
                  {blog.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Blog tags">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-3 py-1 text-xs font-medium text-gray-400 transition-colors border rounded-full border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                      role="listitem"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Date and Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={14} />
                    <span>{blog.date}</span>
                  </div>
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="flex items-center gap-2 text-sm font-medium text-blue-400 transition-colors rounded hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label={`Read more about ${blog.title}`}
                  >
                    Read More
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/blogs" className="inline-block text-center btn-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 focus-visible:ring-blue-400" aria-label="View all blog articles">
            Show all blogs
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
