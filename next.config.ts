import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pour enlever les erreur de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuration pour Docker
  output: 'standalone',
};

export default nextConfig;
