// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hilangin semua warning source map dari Turbopack
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    // Nonaktifin source map warning (cuma buat dev)
    turbotrace: {
      logLevel: 'error', // hanya error penting yang muncul
    },
  },
  // Abaikan warning source map dari node_modules
  webpack: (config) => {
    config.ignoreWarnings = [
      {
        module: /node_modules/,
        message: /source map/,
      },
    ]
    return config
  },
}

module.exports = nextConfig