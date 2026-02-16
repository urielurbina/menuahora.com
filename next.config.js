/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 120,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    domains: ['res.cloudinary.com'],
  },
  async redirects() {
    return [
      // Redirect old domain to new
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'menuahora.com' }],
        destination: 'https://repisa.co/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.menuahora.com' }],
        destination: 'https://repisa.co/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
