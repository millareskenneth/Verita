import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent ESLint errors from blocking Vercel production builds.
  // Linting still runs in CI; this only skips the build-time check.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow images served from the Render backend (update with your Render hostname).
  // Example: "verita-api-xxxx.onrender.com"
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.onrender.com",
      },
    ],
  },
};

export default nextConfig;
