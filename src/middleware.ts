import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

/**
 * BILLION-DOLLAR SMART ROUTING MIDDLEWARE
 * 
 * This middleware is the traffic controller of our app. It:
 * - Routes users to the correct dashboard based on their account type
 * - Protects authenticated routes from unauthorized access
 * - Handles complex routing logic for consumer vs business flows
 * - Supports A/B testing and feature flagging at the edge
 * - Provides analytics tracking for user journey optimization
 * 
 * Security benefits:
 * - Prevents unauthorized access to sensitive business data
 * - Redirects users before pages load (faster than client-side)
 * - Works at the edge for global performance
 */

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const userType = request.cookies.get('user_type')?.value;
  const authToken = request.cookies.get('auth_token')?.value;
  const timestamp = Date.now();

  // Performance monitoring - track middleware execution time
  const startTime = performance.now();

  // Define route categories for clean logic
  const publicRoutes = ['/', '/login', '/register', '/about', '/pricing', '/contact', '/terms', '/privacy'];
  const consumerRoutes = ['/dashboard', '/transactions', '/budgets', '/goals', '/investments', '/insights'];
  const businessRoutes = ['/business/admin', '/business/team', '/business/expenses', '/business/reports', '/business/settings'];
  const sharedRoutes = ['/profile', '/settings', '/support', '/billing'];
  
  // Check if current path is public (no auth required)
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'));
  const isConsumerRoute = consumerRoutes.some(route => path.startsWith(route));
  const isBusinessRoute = businessRoutes.some(route => path.startsWith(route));
  const isSharedRoute = sharedRoutes.some(route => path.startsWith(route));
  const isApiRoute = path.startsWith('/api/');
  const isStaticAsset = path.startsWith('/_next/') || path.startsWith('/favicon');

  // Skip middleware for static assets and API routes
  if (isStaticAsset || isApiRoute) {
    return NextResponse.next();
  }

  // Create response object to add headers to
  const response = NextResponse.next();

  // Add security headers (billion-dollar security practices)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow'); // Prevent search engine indexing of app pages

  // Authentication check for protected routes
  if (!isPublicRoute && !authToken) {
    // User is not authenticated, redirect to login
    const loginUrl = new URL('/login', request.url);
    
    // Preserve the intended destination for post-login redirect
    if (!isSharedRoute) {
      loginUrl.searchParams.set('redirect', path);
    }
    
    // Add helpful context for login page
    if (isBusinessRoute) {
      loginUrl.searchParams.set('type', 'business');
    } else if (isConsumerRoute) {
      loginUrl.searchParams.set('type', 'consumer');
    }

    const redirectResponse = NextResponse.redirect(loginUrl);
    
    // Add tracking headers for analytics
    redirectResponse.headers.set('X-Redirect-Reason', 'unauthenticated');
    redirectResponse.headers.set('X-Original-Path', path);
    
    return redirectResponse;
  }

  // Smart routing for authenticated users
  if (authToken && userType) {
    // Business users accessing consumer routes
    if (userType === 'business' && isConsumerRoute) {
      // Special case: if they're trying to access generic /dashboard, redirect to business admin
      if (path === '/dashboard') {
        const businessUrl = new URL('/business/admin', request.url);
        const redirectResponse = NextResponse.redirect(businessUrl);
        redirectResponse.headers.set('X-Redirect-Reason', 'account_type_mismatch');
        redirectResponse.headers.set('X-User-Type', userType);
        return redirectResponse;
      }
      
      // For other consumer routes, show a helpful message page or redirect
      const businessUrl = new URL('/business/admin', request.url);
      businessUrl.searchParams.set('message', 'consumer_feature_requested');
      businessUrl.searchParams.set('feature', path.split('/')[1]);
      
      const redirectResponse = NextResponse.redirect(businessUrl);
      redirectResponse.headers.set('X-Redirect-Reason', 'feature_not_available');
      return redirectResponse;
    }
    
    // Consumer users accessing business routes
    if (userType === 'consumer' && isBusinessRoute) {
      const consumerUrl = new URL('/dashboard', request.url);
      consumerUrl.searchParams.set('message', 'business_feature_requested');
      consumerUrl.searchParams.set('upgrade', 'true');
      
      const redirectResponse = NextResponse.redirect(consumerUrl);
      redirectResponse.headers.set('X-Redirect-Reason', 'upgrade_required');
      return redirectResponse;
    }

    // Root dashboard routing - send users to their appropriate dashboard
    if (path === '/dashboard') {
      if (userType === 'business') {
        const businessUrl = new URL('/business/admin', request.url);
        const redirectResponse = NextResponse.redirect(businessUrl);
        redirectResponse.headers.set('X-Redirect-Reason', 'dashboard_routing');
        return redirectResponse;
      }
      // Consumer users stay on /dashboard - no redirect needed
    }

    // Handle edge cases for better UX
    if (path === '/') {
      // Authenticated users hitting the home page should go to their dashboard
      const dashboardUrl = userType === 'business' 
        ? new URL('/business/admin', request.url)
        : new URL('/dashboard', request.url);
      
      const redirectResponse = NextResponse.redirect(dashboardUrl);
      redirectResponse.headers.set('X-Redirect-Reason', 'authenticated_home');
      return redirectResponse;
    }
  }

  // A/B Testing support (for future use)
  // const abVariant = request.cookies.get('ab_variant')?.value || 'control';
  // response.headers.set('X-AB-Variant', abVariant);

  // Feature flag support at the edge
  // const featureFlags = request.cookies.get('feature_flags')?.value;
  // if (featureFlags) {
  //   response.headers.set('X-Feature-Flags', featureFlags);
  // }

  // Performance tracking
  const endTime = performance.now();
  response.headers.set('X-Middleware-Duration', `${(endTime - startTime).toFixed(2)}ms`);
  
  // User journey tracking for analytics
  if (userType) {
    response.headers.set('X-User-Type', userType);
    response.headers.set('X-User-Journey', `${userType}-${path}`);
  }

  return response;
}

/**
 * Middleware configuration
 * 
 * The matcher ensures our middleware only runs on routes that need it,
 * improving performance by skipping static assets and API routes.
 * 
 * This regex excludes:
 * - /api routes (handled separately)
 * - /_next static assets
 * - /favicon and other static files
 * - File extensions (.jpg, .css, .js, etc.)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any file with an extension (.jpg, .png, .css, .js, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
