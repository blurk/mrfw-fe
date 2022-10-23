const { withPlaiceholder } = require('@plaiceholder/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [process.env.NODE_ENV === 'development' ? '127.0.0.1' : process.env.DOMAIN],
  },
};

module.exports = withPlaiceholder(nextConfig);
