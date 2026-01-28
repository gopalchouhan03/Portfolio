'use client';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SetupSection from '@/components/SetupSection';
import LifeSection from '@/components/LifeSection';
import BlogsSection from '@/components/BlogsSection';
import CTASection from '@/components/CTASection';
import GitHubSection from '@/components/GitHubSection';
import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import { useEffect } from 'react';
import ProjectsSection from '@/components/ProjectsSection';
import AboutMeSection from '@/components/AboutMeSection';

export default function Home() {
  useEffect(() => {
    // Add keyboard shortcut for search (Cmd/Ctrl + K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();

      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="relative min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-slate-950 cursor-none">
      <CustomCursor />
      <Navbar />

      {/* Home Section */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Projects Section */}
      <section id="projects">
        <ProjectsSection />
      </section>

      {/* About Me Section */}
      <section id="about-me">
        <AboutMeSection />
      </section>

      {/* GitHub Section */}
      <section id="github">
        <GitHubSection />
      </section>

      {/* Blogs Section */}
      <section id="blogs">
        <BlogsSection />
      </section>

      {/* Call to Action */}
      <section id="cta">
        <CTASection />
      </section>

      {/* Setup Section */}
      <section id="setup">
        <SetupSection />
      </section>

      {/* Life Section */}
      <section id="life">
        <LifeSection />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
