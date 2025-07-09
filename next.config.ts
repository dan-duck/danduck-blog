import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build time optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ["remark", "remark-html", "gray-matter"],
  },
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },
  
  // Output optimization
  output: "standalone",
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
