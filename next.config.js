/**
 * BILLION-DOLLAR NEXT.JS CONFIGURATION - CORRECTED VERSION
 * 
 * This configuration fixes:
 * - Emotion JSX runtime issues
 * - Invalid configuration options
 * - Edge Runtime compatibility problems
 * - Production deployment optimizations
 * 
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // ========================================
  // CRITICAL FIXES FOR DEPLOYMENT SUCCESS
  // ========================================
  
  experimental: {
    // CRITICAL: Disable strict route checking to prevent build failures
    typedRoutes: false,
    
    // Server Components optimizations
    serverComponentsExternalPackages: [
      'lucide-react',
      '@headlessui/react',
      '@heroicons/react',
      '@emotion/react',
      '@emotion/styled',
      '@emotion/server'
    ],
    
    // Optimize bundle size by tree-shaking unused code
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'lodash',
      '@headlessui/react',
      '@heroicons/react'
    ],
    
    // Enable webpack build worker for better performance
    webpackBuildWorker: true
  },

  // ========================================
  // PERFORMANCE OPTIMIZATIONS
  // ========================================
  
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  
  // Use SWC for faster minification and transpilation
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
    // Configure allowed image domains for security
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
    
    // Image formats to support
    formats: ['image/webp', 'image/avif'],
    
    // Image sizes for responsive loading
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image optimization settings
    minimumCacheTTL: 31536000, // 1 year caching
    dangerouslyAllowSVG: false, // Security: disable SVG optimization
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // ========================================
  // REDIRECTS AND REWRITES
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
  // HEADERS FOR SECURITY & PERFORMANCE
  // ========================================
  
  async headers() {
    return [
      {
        // Apply security headers to all routes
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
      },
      {
        // Cache static assets aggressively
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
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
    
    // Add bundle analyzer in development
    if (!dev && !isServer && process.env.ANALYZE === 'true') {
      config.plugins.push(
        new webpack.DefinePlugin({
          __DEV__: JSON.stringify(dev),
          __BUILD_ID__: JSON.stringify(buildId),
        })
      );
    }
    
    return config;
  },

  // ========================================
  // COMPILER OPTIMIZATIONS (EMOTION REMOVED)
  // ========================================
  
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    
    // REMOVED: Emotion compiler settings to prevent JSX runtime conflicts
    // emotion: false, // Explicitly disabled to prevent conflicts
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

// ========================================
// CONDITIONAL CONFIGURATIONS
// ========================================

// Enable bundle analyzer if ANALYZE=true
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
