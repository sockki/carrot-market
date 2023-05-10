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
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    TWILIO_SID: process.env.TWILIO_SID,
    TWILIO_TOKEN: process.env.TWILIO_TOKEN,
    MESSAGE_SERVICES_SID: process.env.MESSAGE_SERVICES_SID,
    MY_PHONE: process.env.MY_PHONE,
    MAIL_ID: process.env.MAIL_ID,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    COOKIE_PASSWORD: process.env.COOKIE_PASSWORD,
    CLOUDFLARE_IMAGES_TOKEN: process.env.CLOUDFLARE_IMAGES_TOKEN,
    CLOUDFLARE_IMAGES_ACCOUTID: process.env.CLOUDFLARE_IMAGES_ACCOUTID,
  },
}



module.exports = nextConfig
