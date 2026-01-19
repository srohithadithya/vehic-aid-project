const isGHPages = process.env.GH_PAGES === 'true';

const nextConfig = {
  output: isGHPages ? 'export' : 'standalone',
  basePath: isGHPages ? '/vehic-aid-project/admin' : '',
  images: {
    unoptimized: true,
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
