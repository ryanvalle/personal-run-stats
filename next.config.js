/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**',
      },
    ]
  },
  env: {
    NOTION_TOKEN: process.env.NOTION_TOKEN
  }
}

module.exports = nextConfig
