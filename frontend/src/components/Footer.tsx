'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

const QUOTES = [
  { text: "Arise, awake, and stop not till the goal is reached.", author: 'Katha Upanishad' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs' },
  { text: 'Life is what happens when you are busy making other plans.', author: 'John Lennon' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
  { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle' },
  { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
  { text: 'Your time is limited, so don\'t waste it living someone else\'s life.', author: 'Steve Jobs' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'Success is not final, failure is not fatal.', author: 'Winston Churchill' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins' },
  { text: 'Great things never came from comfort zones.', author: 'Unknown' },
  { text: 'Dream bigger. Do bigger.', author: 'Unknown' },
];

export default function Footer() {
  const [dailyQuote, setDailyQuote] = useState<typeof QUOTES[0] | null>(null);
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [visitorError, setVisitorError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch real visitor count from API and increment
    const fetchVisitorCount = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      console.log('🔄 Visitor Counter: Connecting to', apiUrl);
      
      try {
        // First test if backend is alive with health check
        try {
          const healthRes = await fetch(`${apiUrl}/health`, { method: 'GET' });
          if (healthRes.ok) {
            const healthData = await healthRes.json();
            console.log('✅ Backend health check passed:', healthData);
          }
        } catch (healthErr) {
          console.warn('⚠️ Health check failed (non-critical):', healthErr);
        }
        
        // Now increment visitor count
        const postResponse = await fetch(`${apiUrl}/visitor-count`, { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inc: 1 }),
        });
        
        if (postResponse.ok) {
          const data = await postResponse.json();
          console.log('✅ Visitor count incremented:', data);
          setVisitorCount(data.count || null);
          setVisitorError(null);
          return;
        } else {
          const errorText = await postResponse.text();
          console.error(`❌ POST returned ${postResponse.status}:`, errorText);
          throw new Error(`HTTP ${postResponse.status}: ${postResponse.statusText}`);
        }
      } catch (postErr) {
        console.error('❌ POST /visitor-count failed:', postErr);
        
        // Try fallback: just fetch current count
        try {
          console.log('🔄 Trying fallback GET request...');
          const getResponse = await fetch(`${apiUrl}/visitor-count`, { method: 'GET' });
          
          if (getResponse.ok) {
            const data = await getResponse.json();
            console.log('✅ Visitor count fetched (fallback):', data);
            setVisitorCount(data.count || null);
            setVisitorError(null);
            return;
          } else {
            throw new Error(`HTTP ${getResponse.status}`);
          }
        } catch (getErr) {
          console.error('❌ GET /visitor-count failed:', getErr);
          const errorMsg = postErr instanceof Error ? postErr.message : 'Connection error';
          console.error(`❌ Final error: ${errorMsg}`);
          setVisitorError(errorMsg);
          setVisitorCount(null);
        }
      }
    };

    fetchVisitorCount();

    // Get daily quote based on date
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('quoteDate');
    const storedQuote = localStorage.getItem('dailyQuote');

    if (storedDate === today && storedQuote) {
      setDailyQuote(JSON.parse(storedQuote));
    } else {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      const newQuote = QUOTES[randomIndex];
      localStorage.setItem('quoteDate', today);
      localStorage.setItem('dailyQuote', JSON.stringify(newQuote));
      setDailyQuote(newQuote);
    }
  }, []);


  return (
    <footer className="relative transition-colors duration-300 border-t border-white/10 bg-linear-to-b from-slate-950 to-black/50" aria-label="Website footer">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-16">
        {/* Quote Section */}
        {dailyQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-4 mb-12 transition-colors duration-300 border sm:p-6 rounded-2xl border-white/10 bg-white/5 backdrop-blur-md"
          >
            <div className="flex gap-3 sm:gap-4">
              <div className="text-2xl font-bold text-blue-400 shrink-0 sm:text-4xl opacity-30">&ldquo;</div>
              <div>
                <p className="mb-2 text-sm italic font-light sm:mb-3 sm:text-base text-slate-100">
                  {dailyQuote.text}
                </p>
                <p className="text-xs text-gray-400 sm:text-sm">
                  — {dailyQuote.author}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Visitor Counter */}
        <div className="flex justify-center px-2 mb-12">
          {visitorCount !== null ? (
            <div className="flex flex-col items-center gap-2 px-4 py-3 transition-colors duration-300 border rounded-full sm:flex-row sm:gap-3 sm:px-6 border-blue-500/30 bg-blue-500/10 backdrop-blur-md">
              <Eye className="w-5 h-5 text-blue-400 shrink-0" />
              <span className="text-xs font-medium text-center sm:text-sm text-slate-900 dark:text-slate-100 sm:text-left">
                You are the <span className="font-bold text-blue-600 dark:text-blue-400">{visitorCount.toLocaleString()}</span>
                <sup className="text-xs">th</sup> visitor
              </span>
            </div>
          ) : visitorError ? (
            <div className="flex flex-col items-center gap-2 px-4 py-3 transition-colors duration-300 border rounded-full sm:flex-row sm:gap-3 sm:px-6 border-amber-500/30 bg-amber-500/10 backdrop-blur-md">
              <Eye className="w-5 h-5 shrink-0 text-amber-400" />
              <span className="text-xs font-medium text-center sm:text-sm text-amber-900 dark:text-amber-100 sm:text-left">
                Visitor counter unavailable 
                <br className="sm:hidden" />
                ({visitorError})
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium sm:text-sm text-slate-400">Loading visitor counter...</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px mb-8 transition-colors duration-300 bg-linear-to-r from-transparent via-slate-300 dark:via-white/10 to-transparent" aria-hidden="true" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-gray-500">
          <p className="text-center">
            Design &amp; Developed by <span className="font-semibold text-slate-900 dark:text-slate-100">Gopal~Codes</span>
          </p>
          <p className="text-center">© {new Date().getFullYear()}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
