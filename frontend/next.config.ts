import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;