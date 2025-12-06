import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.brawlify.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
