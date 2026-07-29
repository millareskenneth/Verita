import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images served from the Render backend.
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

