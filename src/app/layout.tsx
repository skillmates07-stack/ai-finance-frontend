import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

// ============================================================================
// ENTERPRISE-GRADE ROOT LAYOUT - SEO & Performance Optimized
// ============================================================================

// Font optimization with proper fallbacks
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | AI Finance Assistant',
    default: 'AI Finance Assistant - Your Personal CFO',
  },
  description: 'Transform your financial life with AI-powered expense tracking, smart categorization, and intelligent insights. Built for freelancers, entrepreneurs, and anyone who wants to master their money.',
  keywords: [
    'personal finance',
    'ai finance',
    'expense tracking',
    'budgeting app',
    'financial assistant',
    'money management',
    'freelancer finance',
    'smart budgeting',
    'ai categorization',
    'financial planning'
  ],
  authors: [{ name: 'AI Finance Team' }],
  creator: 'AI Finance Assistant',
  publisher: 'AI Finance Assistant',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ai-finance-frontend.netlify.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'AI Finance Assistant',
    title: 'AI Finance Assistant - Your Personal CFO',
    description: 'Transform your financial life with AI-powered expense tracking and intelligent insights.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Finance Assistant - Smart Personal Finance Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Finance Assistant - Your Personal CFO',
    description: 'Transform your financial life with AI-powered expense tracking and intelligent insights.',
    images: ['/og-image.jpg'],
    creator: '@AIFinanceApp',
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
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: 'finance',
  classification: 'Personal Finance Management',
  generator: 'Next.js',
  applicationName: 'AI Finance Assistant',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        {/* ✅ Removed problematic font preload that was causing 404s */}
        
        {/* Critical resource hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and PWA icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* PWA and mobile optimization */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Finance" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="origin-when-cross-origin" />
        
        {/* Performance optimization */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Prevent zoom on form inputs (iOS) */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>
      
      <body className="font-inter antialiased bg-gray-50 selection:bg-blue-100 selection:text-blue-900 min-h-screen">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 font-medium shadow-lg"
        >
          Skip to main content
        </a>
        
        {/* Main app content */}
        <div id="main-content" className="relative">
          {children}
        </div>
        
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontFamily: 'var(--font-inter)',
              fontSize: '14px',
              fontWeight: '500',
              maxWidth: '400px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
              style: {
                border: '1px solid #d1fae5',
                background: '#f0fdf4',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffff',
              },
              style: {
                border: '1px solid #fecaca',
                background: '#fef2f2',
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
        
        {/* Development indicator */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50 opacity-60 hover:opacity-100 transition-opacity duration-200">
            <div className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
              DEV MODE
            </div>
          </div>
        )}

        {/* Performance monitoring script placeholder */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Performance monitoring initialization
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js');
                  });
                }
                
                // Basic analytics placeholder
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
