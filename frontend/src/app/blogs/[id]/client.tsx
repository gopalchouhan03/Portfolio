"use client";

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, Share2, Heart, MessageCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { blogsData } from '@/lib/blogs';
import React, { useState, useEffect } from 'react';

interface BlogDetailClientProps {
  blog?: {
    id: number;
    title: string;
    description: string;
    content: string;
    tags: string[];
    cover?: string;
    date?: string;
    readTime?: string;
    author?: string;
    category?: string;
  } | null;
}

export function BlogDetailClient({ blog }: BlogDetailClientProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Calculate previous, next, and related blogs
  const currentIndex = blogsData.findIndex((b) => b.id === blog?.id);
  const prevBlog = currentIndex > 0 ? blogsData[currentIndex - 1] : null;
  const nextBlog = currentIndex < blogsData.length - 1 ? blogsData[currentIndex + 1] : null;
  const relatedBlogs = blogsData.filter(
    (b) => b.category === blog?.category && b.id !== blog?.id
  ).slice(0, 3);

  useEffect(() => {
    if (!blog?.id) return;
    const id = blog.id;
    const storageLiked = localStorage.getItem(`blog-liked-${id}`);
    const storageCount = localStorage.getItem(`blog-likes-${id}`);
    const t = setTimeout(() => {
      setLiked(storageLiked === 'true');
      setLikeCount(storageCount ? parseInt(storageCount) : 0);
    }, 0);
    return () => clearTimeout(t);
  }, [blog?.id]);

  if (!blog) {
    return (
      <main className="min-h-screen transition-colors duration-300 bg-slate-950 text-slate-100">
        <Navbar />
        <div className="max-w-6xl px-4 py-20 mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-100">Blog not found</h1>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen transition-colors duration-300 bg-slate-950 text-slate-100">
      <Navbar />

      <div className="max-w-4xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            <ArrowLeft size={16} />
            Back to Blogs
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1 text-sm font-medium text-blue-400 bg-blue-800/40 rounded-full">
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl text-slate-100">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <time dateTime={blog.date}>{blog.date}</time>
            </div>
            <span>{blog.readTime}</span>
            <span>by {blog.author}</span>
          </div>
        </motion.div>

        {/* Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div
            className="w-full overflow-hidden shadow-lg h-96 rounded-2xl"
          >
            <img
              src={blog.cover}
              alt={blog.title}
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
            {blog.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-3 py-1 text-sm font-medium border rounded-full border-white/10 bg-white/5 text-gray-300"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12 prose max-w-none"
        >
          <div className="space-y-6 text-lg leading-relaxed text-gray-300">
            {blog.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('##')) {
                const heading = paragraph.replace('## ', '');
                return (
                  <h2
                    key={idx}
                    className="mt-8 mb-4 text-2xl font-bold text-slate-100"
                  >
                    {heading}
                  </h2>
                );
              }
              if (paragraph.startsWith('-')) {
                const items = paragraph.split('\n').filter((line) => line.startsWith('-'));
                return (
                  <ul key={idx} className="ml-4 space-y-2 list-disc list-inside">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>
        </motion.article>

        {/* Social Sharing & Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center gap-6 py-8 border-t border-b border-white/10"
        >
          <button
            onClick={() => {
              if (!blog?.id) return;
              const newLiked = !liked;
              setLiked(newLiked);
              const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);
              setLikeCount(newCount);
              localStorage.setItem(`blog-liked-${blog.id}`, newLiked.toString());
              localStorage.setItem(`blog-likes-${blog.id}`, newCount.toString());
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors text-gray-300 hover:text-blue-300"
          >
            <Heart size={18} />
            {liked ? 'Liked' : 'Like'} {likeCount > 0 && `(${likeCount})`}
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: blog.title,
                    text: blog.description,
                    url: typeof window !== 'undefined' ? window.location.href : '',
                  })
                  .catch(() => {});
              } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
                alert('Blog link copied to clipboard!');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors text-gray-300 hover:text-blue-300"
          >
            <Share2 size={18} />
            Share
          </button>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid gap-8 my-12 md:grid-cols-2"
        >
          {prevBlog ? (
            <Link href={`/blogs/${prevBlog.id}`} className="group">
              <div className="p-6 transition-all duration-300 border rounded-lg glass-card hover:shadow-lg">
                <div className="flex items-center gap-2 mb-3 text-sm text-blue-400">
                  <ArrowLeft size={16} />
                  Previous
                </div>
                  <h3 className="text-lg font-semibold transition-colors text-slate-100 group-hover:text-blue-300">
                  {prevBlog.title}
                </h3>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextBlog ? (
            <Link href={`/blogs/${nextBlog.id}`} className="group md:ml-auto md:col-span-1">
              <div className="p-6 transition-all duration-300 border rounded-lg glass-card hover:shadow-lg">
                <div className="flex items-center justify-end gap-2 mb-3 text-sm text-blue-400">
                  Next
                  <ArrowRight size={16} />
                </div>
                <h3 className="text-lg font-semibold text-right transition-colors text-slate-100 group-hover:text-blue-300">
                  {nextBlog.title}
                </h3>
              </div>
            </Link>
          ) : (
            <div />
          )}
        </motion.div>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16"
          >
            <h2 className="mb-8 text-2xl font-bold text-slate-100">
              Related Posts
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedBlogs.map((relatedBlog) => (
                <Link key={relatedBlog.id} href={`/blogs/${relatedBlog.id}`} className="group">
                  <div className="overflow-hidden transition-all duration-300 rounded-lg glass-card hover:shadow-lg">
                    <div className="h-40 overflow-hidden">
                      <img
                        src={relatedBlog.cover}
                        alt={relatedBlog.title}
                        className="object-cover w-full h-full rounded-xl"
                      />
                    </div>
                    <div className="p-4">
                      <span className="inline-block px-2 py-1 mb-2 text-xs font-medium text-blue-400 bg-blue-800/40 rounded">
                        {relatedBlog.category}
                      </span>
                      <h3 className="mb-2 font-semibold transition-colors text-slate-100 group-hover:text-blue-300 line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-300 line-clamp-2">
                        {relatedBlog.description}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-xs text-gray-300">
                        <Calendar size={14} />
                        {relatedBlog.date}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}