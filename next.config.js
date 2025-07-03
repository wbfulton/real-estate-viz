// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/app/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
    domains: ["aqua.kingcounty.gov"],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
