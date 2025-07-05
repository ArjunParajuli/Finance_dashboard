// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Prevents TypeScript from breaking the build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors on Vercel
  },
};

module.exports = nextConfig;
