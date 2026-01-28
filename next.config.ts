import type { NextConfig } from "next";

/**
 * Next.js Configuration
 *
 * output: 'standalone' - Required for Docker deployments
 * This creates a minimal standalone build that includes only necessary files,
 * reducing image size and improving deployment performance.
 */
const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
