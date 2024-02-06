/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.zara.net',
        port: '',
        pathname: '/photos/**',
      },
    ],
  },
};

export default nextConfig;
