import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "files.freemusicarchive.org",
      },
      {
        protocol: "https",
        hostname: "jamendo.com",
      },
      {
        protocol: "https",
        hostname: "freesound.org",
      },
    ],
  },
  // Fix 1: Replace experimental.serverComponentsExternalPackages with serverExternalPackages

  serverExternalPackages: ["howler", "tone"],

  // Fix 2: Add empty turbopack config to resolve the error
  
  turbopack: {},

  // Optional: Enable webpack if you want to use webpack instead of turbopack
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     ...config.resolve.fallback,
  //     fs: false,
  //     path: false,
  //   };
  //   return config;
  // },
};

export default nextConfig;
