/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',

    images: {
        remotePatterns: [
            { protocol: "https", hostname: "randomuser.me" },
            { protocol: "https", hostname: "1000logos.net" },
            { protocol: "https", hostname: "logos-world.net" },
            { protocol: "https", hostname: "imgcdn.stablediffusionweb.com" },
            { protocol: "https", hostname: "static.vecteezy.com" },
            { protocol: "https", hostname: "cdn-icons-png.flaticon.com" },
            { protocol: "https", hostname: "seeklogo.com" },
            { protocol: "https", hostname: "upload.wikimedia.org" },
            { protocol: "http", hostname: "localhost", port: "" },
            { protocol: "http", hostname: "127.0.0.1", port: "" },
            { protocol: "http", hostname: "localhost", port: "3000" },
            { protocol: "http", hostname: "localhost", port: "3001" },
            { protocol: "https", hostname: "**", port: "" },
        ],
    },

    eslint: {
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
