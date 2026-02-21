'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface SearchSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'blog' | 'skill' | 'section';
  href: string;
  icon?: string;
}

const suggestions: SearchSuggestion[] = [
  // Projects
  {
    id: 'project-1',
    title: 'Udaan - Career Guidance Platform',
    description: 'AI-powered career guidance for students',
    type: 'project',
    href: '/projects/1',
  },
  {
    id: 'project-2',
    title: 'View All Projects',
    description: 'Browse complete portfolio of work',
    type: 'project',
    href: '/projects',
  },
  // Blogs
  {
    id: 'blog-1',
    title: 'MERN Stack for Freshers',
    description: 'Real-world MERN stack project structure',
    type: 'blog',
    href: '/blogs/1',
  },
  {
    id: 'blog-2',
    title: 'View All Blogs',
    description: 'Browse dev articles and insights',
    type: 'blog',
    href: '/blogs',
  },
  // Skills
  {
    id: 'skill-1',
    title: 'React & Next.js',
    description: 'Frontend framework expertise',
    type: 'skill',
    href: '/',
  },
  {
    id: 'skill-2',
    title: 'Node.js & Express',
    description: 'Backend development experience',
    type: 'skill',
    href: '/',
  },
  {
    id: 'skill-3',
    title: 'MongoDB & Databases',
    description: 'Database design and optimization',
    type: 'skill',
    href: '/',
  },
  {
    id: 'skill-4',
    title: 'TypeScript & JavaScript',
    description: 'Full stack development languages',
    type: 'skill',
    href: '/',
  },
  // Sections
  {
    id: 'section-1',
    title: 'About Me',
    description: 'Learn more about my background',
    type: 'section',
    href: '/',
  },
  {
    id: 'section-2',
    title: 'GitHub Contributions',
    description: 'View my contribution activity',
    type: 'section',
    href: '#github',
  },
  {
    id: 'section-3',
    title: 'Life & Setup',
    description: 'My development environment',
    type: 'section',
    href: '/',
  },
];

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>(suggestions);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSuggestions(suggestions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.title.toLowerCase().includes(query) ||
        suggestion.description.toLowerCase().includes(query) ||
        suggestion.type.toLowerCase().includes(query)
    );
    setFilteredSuggestions(filtered);
  }, [searchQuery]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const getTypeIcon = (type: SearchSuggestion['type']) => {
    const icons = {
      project: '📁',
      blog: '📝',
      skill: '⚡',
      section: '📍',
    };
    return icons[type];
  };

  const getTypeBgColor = (type: SearchSuggestion['type']) => {
    const colors = {
      project: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      blog: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      skill: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      section: 'bg-green-500/20 text-green-300 border-green-500/30',
    };
    return colors[type];
  };

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="items-center hidden gap-2 px-3 py-2 text-sm text-gray-400 transition-all border rounded-lg sm:flex border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Open search"
      >
        <Search className="w-4 h-4" />
        <span className="hidden text-xs lg:inline">Search</span>
        <span className="ml-2 text-xs text-gray-500">⌘K</span>
      </motion.button>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-[480px] max-w-[calc(100vw-32px)] bg-slate-900 border border-white/10 rounded-lg shadow-2xl z-[100] overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-white/10 bg-slate-950">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search projects, blogs, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-white placeholder-gray-500 bg-transparent outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSearchQuery('')}
                    className="p-1 transition-colors rounded hover:bg-white/10"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Suggestions List */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredSuggestions.length > 0 ? (
                <div className="p-2">
                  {/* Group suggestions by type */}
                  {['project', 'blog', 'skill', 'section'].map((type) => {
                    const grouped = filteredSuggestions.filter(
                      (s) => s.type === type
                    ) as SearchSuggestion[];

                    if (grouped.length === 0) return null;

                    return (
                      <div key={type}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {type === 'project' && '📁 Projects'}
                          {type === 'blog' && '📝 Blogs'}
                          {type === 'skill' && '⚡ Skills'}
                          {type === 'section' && '📍 Sections'}
                        </div>
                        {grouped.map((suggestion) => (
                          <Link
                            key={suggestion.id}
                            href={suggestion.href}
                            onClick={handleSuggestionClick}
                          >
                            <motion.div
                              whileHover={{ x: 4 }}
                              className="px-2 py-2.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-lg">
                                      {getTypeIcon(suggestion.type)}
                                    </span>
                                    <p className="text-sm font-medium text-white transition-colors group-hover:text-blue-400">
                                      {suggestion.title}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    {suggestion.description}
                                  </p>
                                </div>
                                <ExternalLink className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-400">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Try searching for projects, blogs, or skills
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 bg-slate-950">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex gap-4">
                  <span>↑↓ to navigate</span>
                  <span>↵ to select</span>
                </div>
                <span>ESC to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
