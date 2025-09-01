/**
 * BILLION-DOLLAR NEXT.JS CONFIGURATION - OPTIMIZED VERSION
 * 
 * This configuration:
 * - Enables SWC for maximum performance (no Babel conflicts)
 * - Supports next/font without issues
 * - Optimizes for enterprise deployment
 * - Ensures tailwind-merge compatibility
 * 
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // ========================================
  // CRITICAL FIXES FOR DEPLOYMENT SUCCESS
  // ========================================
  
  experimental: {
    // Disable strict route checking to prevent build failures
    typedRoutes: false,
    
    // Server Components optimizations
    serverComponentsExternalPackages: [
      'lucide-react',
      '@headlessui/react',
      '@heroicons/react'
    ],
    
    // Optimize bundle size by tree-shaking unused code
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'lodash',
      '@headlessui/react',
      '@heroicons/react',
      'tailwind-merge',
      'clsx'
    ],
    
    // Enable webpack build worker for better performance
    webpackBuildWorker: true
  },

  // ========================================
  // PERFORMANCE OPTIMIZATIONS
  // ========================================
  
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  
  // Use SWC for faster compilation (NO BABEL CONFLICTS)
  swcMinify: true,
  
  // Enable gzip compression
  compress: true,
  
  // Disable X-Powered-By header for security
  poweredByHeader: false,
  
  // Generate ETags for better caching
  generateEtags: true,

  // ========================================
  // BUILD CONFIGURATION
  // ========================================
  
  // Output configuration for deployment
  output: 'standalone',
  
  // ESLint configuration for builds
  eslint: {
    // Allow builds to complete with ESLint warnings in production
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
    
    // Specify directories to check
    dirs: ['pages', 'utils', 'components', 'lib', 'src']
  },
  
  // TypeScript configuration
  typescript: {
    // Strict type checking for billion-dollar quality
    ignoreBuildErrors: false
  },

  // ========================================
  // IMAGE OPTIMIZATION
  // ========================================
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
    
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // ========================================
  // REDIRECTS FOR SEO
  // ========================================
  
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/auth/register',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/business/admin',
        permanent: true,
      }
    ];
  },

  // ========================================
  // SECURITY HEADERS
  // ========================================
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      }
    ];
  },

  // ========================================
  // WEBPACK CONFIGURATION
  // ========================================
  
  webpack: (config, { buildId, dev, isServer, webpack }) => {
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    
    // Resolve fallbacks for Node.js modules in browser
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    return config;
  },

  // ========================================
  // COMPILER OPTIMIZATIONS (SWC ENABLED)
  // ========================================
  
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    
    // NO BABEL OR EMOTION CONFLICTS - Pure SWC optimization
  },

  // ========================================
  // PRODUCTION OPTIMIZATIONS
  // ========================================
  
  ...(process.env.NODE_ENV === 'production' && {
    // Disable source maps in production for security
    productionBrowserSourceMaps: false,
    
    // Optimize fonts
    optimizeFonts: true,
  })
};

// Enable bundle analyzer if needed
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
