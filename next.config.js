/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static exports for pages that don't need server-side rendering
  output: 'standalone',
}

module.exports = nextConfig
