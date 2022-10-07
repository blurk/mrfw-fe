/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['127.0.0.1', '66fb-222-252-30-231.ap.ngrok.io'],
  },
};

module.exports = nextConfig;
