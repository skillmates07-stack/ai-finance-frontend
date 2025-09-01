'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  CreditCard, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  CheckSquare,
  Shield
} from 'lucide-react';

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout, hasFeature } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login?redirect=business');
      } else if (user?.accountType === 'consumer') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your business dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.accountType !== 'business') {
    return null;
  }

  const navigationItems = [
    { name: 'Overview', href: '/business/admin', icon: BarChart3 },
    { name: 'Team', href: '/business/team', icon: Users },
    { name: 'Expenses', href: '/business/expenses', icon: CreditCard },
    ...(hasFeature('APPROVAL_WORKFLOWS') ? [
      { name: 'Approvals', href: '/business/expenses/approvals', icon: CheckSquare, badge: 'NEW' }
    ] : []),
    { name: 'Reports', href: '/business/reports', icon: FileText },
    { name: 'Settings', href: '/business/settings', icon: Settings },
  ];

  // Safe user data with proper null checks
  const displayName = user?.name ?? 'Business User';
  const companyName = user?.companyName ?? 'Your Company';
  const userRole = user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'User';
  const userPlan = user?.plan?.toUpperCase() ?? 'FREE';

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Finance</span>
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold uppercase">
                BUSINESS
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {companyName}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="truncate">
                    {userRole} • {userPlan} Plan
                  </span>
                  {hasFeature('PRIORITY_SUPPORT') && (
                    <Shield className="h-3 w-3 ml-2 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
              </div>
            </div>
          </div>

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
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="ml-auto px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <img 
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff&size=128`}
                alt={displayName}
                className="h-8 w-8 rounded-full"
              />
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
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

      <div className="lg:pl-64">
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-lg font-bold text-gray-900">Business</span>
          </div>
          <div className="w-10" />
        </div>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
