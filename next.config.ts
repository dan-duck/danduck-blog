import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build time optimization
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  
  // Performance optimizations
  experimental: {
    optimizeCss: true,
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
  
  // Webpack optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce bundle size by replacing server-only modules
      config.resolve.alias = {
        ...config.resolve.alias,
        "fs": false,
        "path": false,
      };
    }
    return config;
  },
};

export default nextConfig;
