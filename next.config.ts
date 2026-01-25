
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dv09dhgcrv5ld6ct.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upoafhtidiwsihwijwex.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  // CAUTION: This is an experimental feature.
  // Note that the cloud IDE domains are temporary and will change.
  allowedDevOrigins: [
    'https://6000-firebase-studio-1767068471018.cluster-ulqnojp5endvgve6krhe7klaws.cloudworkstations.dev',
  ],
};

const withSerwist = require("@serwist/next").default({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: false,
  reloadOnOnline: true,
  // User requested no precaching. 
  // Serwist might still look for a manifest, but we can control the strategy in sw.ts
});

export default withSerwist(nextConfig);

