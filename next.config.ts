import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false
      };
    }
    // Add rule to ignore bpmnlintrc files
    config.module.rules.push({
      test: /\.bpmnlintrc$/,
      use: 'ignore-loader'
    });
    return config;
  },
  serverRuntimeConfig: {
    timeout: 60000
  },
  staticPageGenerationTimeout: 60000
};

export default nextConfig;
