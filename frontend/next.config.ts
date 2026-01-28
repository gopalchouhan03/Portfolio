import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  poweredByHeader: false,
  compress: true,
  // Export as static HTML for Cloudflare Pages
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
};

export default nextConfig;