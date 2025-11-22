import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns: [
      {
        protocol:'https',
        hostname: 'picsum.photos',
      },{
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      //add more if you want { protocol : ..,..,.. }
      {
        protocol: 'https',
        hostname:'files.freemusicarchive.org',
      },
    ],
  },
};

export default nextConfig;
