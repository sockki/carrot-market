const { rule } = require('postcss')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // runtime: 'nodejs',
    // serverComponents: true,
    },
  images: {
    domains: ["imagedelivery.net"]
  }
}



module.exports = nextConfig
