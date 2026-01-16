/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: '.next', // Reverted to default for standalone support
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'api.dicebear.com' },
      { hostname: 'github.com' },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://localhost:8001/api/v1';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
  optimizeFonts: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; // force-recompile-v1
