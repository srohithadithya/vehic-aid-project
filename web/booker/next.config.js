/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/vehic-aid-project/booker',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  optimizeFonts: false,
};

module.exports = nextConfig;
