/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'https',
                hostname: 'api.leaseon.dk',
            },
            {
                protocol: 'https',
                hostname: 'fs.leaseon.dk',
            },
        ],
    },
};

export default nextConfig;
