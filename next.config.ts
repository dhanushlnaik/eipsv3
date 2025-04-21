import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode
  reactStrictMode: true,

  // Enable CSS Support
  cssModules: true, // You can enable this if you're using CSS modules

  // Webpack configuration
  webpack(config, { isServer }) {
    // Ensure that we don't bundle Node.js built-in modules in the browser (e.g., fs, path)
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // This is a fix for issues related to Node.js modules
        path: false,
      };
    }

    return config;
  },

  // Custom Environment Variables (optional)
  env: {
    MY_CUSTOM_ENV: process.env.MY_CUSTOM_ENV || 'default-value',
  },

  // Other settings you might need can be added here (e.g., redirects, headers)
};

export default nextConfig;
