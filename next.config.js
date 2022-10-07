/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
	  domains: [process.env.NODE_ENV === 'production' ? process.env.DOMAIN : '127.0.0.1'],
  },
};

module.exports = nextConfig;
