/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static exports for pages that don't need server-side rendering
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.flashcardmaker.co.uk' }],
        destination: 'https://flashcardmaker.co.uk/:path*',
        permanent: true,
      },
    ];
  },
}

module.exports = nextConfig
