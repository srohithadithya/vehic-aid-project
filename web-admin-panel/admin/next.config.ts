/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { hostname: 'api.dicebear.com' },
      { hostname: 'github.com' },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.API_URL || 'http://localhost:8000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
