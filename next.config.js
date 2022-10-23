const { withPlaiceholder } = require('@plaiceholder/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [process.env.NODE_ENV === 'development' ? '127.0.0.1' : process.env.DOMAIN],
  },
  staticPageGenerationTimeout: 60, // seconds
};

module.exports = withPlaiceholder(nextConfig);
