'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  Target, 
  TrendingUp, 
  Brain,
  Settings,
  LogOut,
  Menu,
  X 
} from 'lucide-react';
import { useState } from 'react';

/**
 * CONSUMER LAYOUT - PERSONAL FINANCE SECTION
 * 
 * This layout wraps all consumer (personal finance) pages and provides:
 * - Authentication guard for consumer users only
 * - Navigation sidebar with personal finance features
 * - Responsive design for mobile and desktop
 * - Feature flag integration for premium features
 * - Professional dashboard experience
 */

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout, hasFeature } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication and authorization guard
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=consumer');
      } else if (user?.accountType === 'business') {
        router.push('/business/admin');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your personal dashboard...</p>
        </div>
      </div>
    );
  }

  // Unauthorized state
  if (!isAuthenticated || user?.accountType !== 'consumer') {
    return null;
  }

  // Navigation items with feature flag integration
  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: false },
    { name: 'Transactions', href: '/transactions', icon: CreditCard, current: false },
    { name: 'Budgets', href: '/budgets', icon: PieChart, current: false },
    { name: 'Goals', href: '/goals', icon: Target, current: false },
    ...(hasFeature('INVESTMENT_TRACKING') ? [
      { name: 'Investments', href: '/investments', icon: TrendingUp, current: false }
    ] : []),
    ...(hasFeature('AI_BUDGET_OPTIMIZER') ? [
      { name: 'AI Insights', href: '/insights', icon: Brain, current: false, badge: 'AI' }
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Finance</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-10 w-10 rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  Personal Finance
                  {user.plan !== 'free' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium uppercase">
                      {user.plan}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                  {item.name}
                  {item.badge && (
                    <span className="ml-auto px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Upgrade prompt for free users */}
            {user.plan === 'free' && (
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Upgrade to Pro</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Unlock AI insights, investment tracking, and more
                    </p>
                    <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-700">
                      Learn more →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Settings and logout */}
          <div className="px-6 py-4 border-t border-gray-200 space-y-1">
            <Link
              href="/settings"
              className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              <Settings className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" />
              Settings
            </Link>
            <button
              onClick={logout}
              className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <div className="h-6 w-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">AI</span>
            </div>
            <span className="ml-2 text-lg font-bold text-gray-900">Finance</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
