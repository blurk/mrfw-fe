/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	i18n: {
		locales: ['en', 'vi'],
		defaultLocale: 'vi',
		localeDetection: process.env.NODE_ENV === 'development' ? false : true
	}
}

module.exports = nextConfig
