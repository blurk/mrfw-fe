const { withPlaiceholder } = require('@plaiceholder/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [process.env.NODE_ENV === 'development' ? '127.0.0.1' : process.env.NEXT_PUBLIC_DOMAIN],
  },
  env: {
    MY_SECRET_TOKEN: process.env.MY_SECRET_TOKEN,
  },
  staticPageGenerationTimeout: 60, // seconds
};

module.exports = withPlaiceholder(nextConfig);
