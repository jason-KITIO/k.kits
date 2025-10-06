import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Configuration pour Docker uniquement (pas sur Vercel)
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
};

export default nextConfig;
