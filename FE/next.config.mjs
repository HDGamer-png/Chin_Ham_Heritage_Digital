/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        typedRoutes: false,
    },
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: '**',
        }, ],
    },
    webpack: (config) => {
        config.module.rules.push({
            resourceQuery: /raw/,
            type: 'asset/source',
        });
        return config;
    },
};

export default nextConfig;