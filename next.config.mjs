/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    experimental: {
        serverActions: {
            bodySizeLimit: '100mb', // Increase limit for audio uploads
        },
    },
};

export default nextConfig;
