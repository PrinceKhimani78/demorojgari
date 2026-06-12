import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "1000logos.net" },
      { protocol: "https", hostname: "logos-world.net" },
      { protocol: "https", hostname: "imgcdn.stablediffusionweb.com" },
      { protocol: "https", hostname: "static.vecteezy.com" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
      { protocol: "https", hostname: "seeklogo.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "localhost", port: "4000" },
      { protocol: "http", hostname: "localhost", port: "3000" },
      { protocol: "http", hostname: "127.0.0.1" },
      { protocol: "https", hostname: "api.rojgariindia.com" },
      { protocol: "https", hostname: "api.mutanttechnologies.com" },
      { protocol: "https", hostname: "**" },
    ],
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.rojgariindia.com/api/:path*',
      },
    ];
  },
};

export default nextConfig;
