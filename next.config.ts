import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add headers to prevent aggressive caching of HTML/JS
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            // Allow caching but always revalidate with server
            value: 'no-cache, must-revalidate',
          },
        ],
      },
      {
        // Static assets can be cached longer
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
