/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['avatars.githubusercontent.com', 'pbs.twimg.com'],
  },
}

module.exports = nextConfig
