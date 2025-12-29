/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const nextConfig = {
  reactStrictMode: true,
  env: {
    ZELDHASH_API_HOST: process.env.ZELDHASH_API_HOST || "https://api.zeldhash.com/",
  },
};

module.exports = withNextIntl(nextConfig);
