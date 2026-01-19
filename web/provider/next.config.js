/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    basePath: '/vehic-aid-project/provider',
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
