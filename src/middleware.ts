import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

/**
 * BILLION-DOLLAR MIDDLEWARE - EDGE RUNTIME COMPATIBLE
 * 
 * This middleware is optimized for Edge Runtime and avoids Node.js core modules.
 * Uses only Web APIs that are supported in the Edge Runtime environment.
 */

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const userType = request.cookies.get('user_type')?.value;
  const authToken = request.cookies.get('auth_token')?.value;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/about', '/pricing', '/contact', '/terms', '/privacy'];
  const consumerRoutes = ['/dashboard', '/transactions', '/budgets', '/goals', '/investments', '/insights'];
  const businessRoutes = ['/business/admin', '/business/team', '/business/expenses', '/business/reports', '/business/settings'];
  const sharedRoutes = ['/profile', '/settings', '/support', '/billing'];
  
  // Check route types using Web APIs only (no Node.js modules)
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'));
  const isConsumerRoute = consumerRoutes.some(route => path.startsWith(route));
  const isBusinessRoute = businessRoutes.some(route => path.startsWith(route));
  const isSharedRoute = sharedRoutes.some(route => path.startsWith(route));
  const isApiRoute = path.startsWith('/api/');
  const isStaticAsset = path.startsWith('/_next/') || path.startsWith('/favicon') || path.includes('.');

  // Skip middleware for static assets and API routes
  if (isStaticAsset || isApiRoute) {
    return NextResponse.next();
  }

  // Create response with security headers
  const response = NextResponse.next();
  
  // Add enterprise-grade security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Authentication check for protected routes
  if (!isPublicRoute && !authToken) {
    // Use Web API URL constructor instead of Node.js url module
    const loginUrl = new URL('/login', request.url);
    
    // Preserve intended destination
    if (!isSharedRoute) {
      loginUrl.searchParams.set('redirect', path);
    }
    
    // Add helpful context
    if (isBusinessRoute) {
      loginUrl.searchParams.set('type', 'business');
    } else if (isConsumerRoute) {
      loginUrl.searchParams.set('type', 'consumer');
    }

    const redirectResponse = NextResponse.redirect(loginUrl);
    redirectResponse.headers.set('X-Redirect-Reason', 'unauthenticated');
    redirectResponse.headers.set('X-Original-Path', path);
    
    return redirectResponse;
  }

  // Smart routing for authenticated users
  if (authToken && userType) {
    // Business users accessing consumer routes
    if (userType === 'business' && isConsumerRoute) {
      if (path === '/dashboard') {
        const businessUrl = new URL('/business/admin', request.url);
        const redirectResponse = NextResponse.redirect(businessUrl);
        redirectResponse.headers.set('X-Redirect-Reason', 'account_type_routing');
        return redirectResponse;
      }
      
      // Redirect other consumer routes to business equivalent
      const businessUrl = new URL('/business/admin', request.url);
      businessUrl.searchParams.set('message', 'consumer_feature_requested');
      
      const redirectResponse = NextResponse.redirect(businessUrl);
      redirectResponse.headers.set('X-Redirect-Reason', 'feature_not_available');
      return redirectResponse;
    }
    
    // Consumer users accessing business routes
    if (userType === 'consumer' && isBusinessRoute) {
      const consumerUrl = new URL('/dashboard', request.url);
      consumerUrl.searchParams.set('message', 'upgrade_required');
      
      const redirectResponse = NextResponse.redirect(consumerUrl);
      redirectResponse.headers.set('X-Redirect-Reason', 'upgrade_required');
      return redirectResponse;
    }

    // Root dashboard routing
    if (path === '/dashboard' && userType === 'business') {
      const businessUrl = new URL('/business/admin', request.url);
      const redirectResponse = NextResponse.redirect(businessUrl);
      redirectResponse.headers.set('X-Redirect-Reason', 'dashboard_routing');
      return redirectResponse;
    }

    // Authenticated users on home page
    if (path === '/') {
      const dashboardUrl = userType === 'business' 
        ? new URL('/business/admin', request.url)
        : new URL('/dashboard', request.url);
      
      const redirectResponse = NextResponse.redirect(dashboardUrl);
      redirectResponse.headers.set('X-Redirect-Reason', 'authenticated_home');
      return redirectResponse;
    }
  }

  // Add tracking headers for analytics
  if (userType) {
    response.headers.set('X-User-Type', userType);
    response.headers.set('X-User-Journey', `${userType}-${path}`);
  }

  // Add timestamp for monitoring
  response.headers.set('X-Middleware-Timestamp', Date.now().toString());

  return response;
}

/**
 * EDGE RUNTIME COMPATIBLE MATCHER
 * Excludes paths that don't need middleware processing
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (.jpg, .png, .css, .js, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
