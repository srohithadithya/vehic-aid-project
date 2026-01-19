/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/vehic-aid-project/admin',
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'api.dicebear.com' },
      { hostname: 'github.com' },
    ],
  },
  optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
