import type {NextConfig} from 'next';

const nextConfig: NextConfig = {


  // Static generation and caching
  output: 'standalone', // Optimize for production deployment
  trailingSlash: false, // Consistent URL structure
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'admin.fedrupp.org',
        port: '',
        pathname: '/**',
      }
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // The eslint block has been removed

};

export default nextConfig;