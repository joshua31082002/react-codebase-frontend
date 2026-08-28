import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for smaller Docker images
  output: "standalone",
};

export default nextConfig;
