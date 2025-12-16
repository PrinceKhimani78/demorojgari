/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    unoptimized: true, // ⬅️ THIS is the fix
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  swcMinify: true,
};

module.exports = nextConfig;
