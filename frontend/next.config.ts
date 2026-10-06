import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/blogs/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;