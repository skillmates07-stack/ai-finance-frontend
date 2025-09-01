import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import './globals.css';

/**
 * BILLION-DOLLAR ROOT LAYOUT
 * 
 * This is the foundation of our entire application. Every page renders inside this layout.
 * 
 * Key features:
 * - Optimized Google Fonts loading for performance
 * - Global authentication state management
 * - Consistent toast notification system
 * - SEO-optimized metadata
 * - Performance monitoring setup
 * - Analytics integration ready
 */

// Font optimization - preload critical fonts for better performance
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Better loading performance
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
});

/**
 * SEO Metadata - Critical for organic growth and professional appearance
 */
export const metadata: Metadata = {
  title: {
    default: 'AI Finance - Smart Financial Management for Everyone',
    template: '%s | AI Finance',
  },
  description: 'Transform your finances with AI-powered insights. Manage personal budgets, business expenses, and investments with enterprise-grade security and intelligent automation.',
  keywords: [
    'personal finance',
    'business finance', 
    'AI financial advisor',
    'expense tracking',
    'budget management',
    'investment tracking',
    'financial planning',
    'business expense management',
    'financial analytics'
  ],
  authors: [{ name: 'AI Finance Team' }],
  creator: 'AI Finance',
  publisher: 'AI Finance',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ai-finance.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AI Finance - Smart Financial Management',
    description: 'Transform your finances with AI-powered insights and professional-grade tools.',
    url: 'https://ai-finance.app',
    siteName: 'AI Finance',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Finance - Smart Financial Management Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Finance - Smart Financial Management',
    description: 'Transform your finances with AI-powered insights and professional-grade tools.',
    images: ['/twitter-image.jpg'],
    creator: '@aifinanceapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
  },
  category: 'finance',
};

/**
 * Root Layout Component
 * 
 * This component wraps every page in our application and provides:
 * - Global font variables
 * - Authentication context
 * - Toast notification system
 * - Global error boundaries (future enhancement)
 * - Analytics initialization (future enhancement)
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* Preload critical resources for better performance */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//analytics.google.com" />
        
        {/* Security headers via meta tags as fallback */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Viewport meta for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Apple touch icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        {/* Global error boundary (future enhancement) */}
        {/* <ErrorBoundary fallback={<GlobalErrorFallback />}> */}
        
        {/* Authentication provider wraps entire app */}
        <AuthProvider>
          {/* Main app content */}
          {children}
          
          {/* Global toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: '400px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#ffffff',
                },
                style: {
                  background: '#059669',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
                style: {
                  background: '#dc2626',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#3b82f6',
                  secondary: '#ffffff',
                },
              },
            }}
          />
          
          {/* Performance monitoring (future enhancement) */}
          {/* <PerformanceMonitor /> */}
          
          {/* Analytics (future enhancement) */}
          {/* <Analytics /> */}
          
          {/* Accessibility improvements (future enhancement) */}
          {/* <A11yAnnouncer /> */}
          
        </AuthProvider>
        
        {/* </ErrorBoundary> */}
        
        {/* Service Worker registration (future enhancement) */}
        {/* <ServiceWorkerRegistration /> */}
      </body>
    </html>
  );
}
