'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Bell, 
  Search, 
  Plus, 
  Settings, 
  User, 
  LogOut, 
  CreditCard,
  BarChart3,
  Menu,
  X 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/api';

// ============================================================================
// NAVBAR COMPONENT - The Command Center
// ============================================================================

interface NavbarProps {
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    } finally {
      setIsLoading(false);
      setIsProfileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and search */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link href="/dashboard" className="flex items-center">
              <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  💰
                </div>
                <div className="ml-3 hidden sm:block">
                  <div className="text-xl font-bold text-gray-900">
                    AI Finance
                  </div>
                  <div className="text-xs text-gray-500 -mt-1">
                    Your Smart CFO
                  </div>
                </div>
              </div>
            </Link>

            {/* Search bar - Desktop */}
            <div className="hidden lg:block ml-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search transactions, categories..."
                />
              </div>
            </div>
          </div>

          {/* Right side - Actions and profile */}
          <div className="flex items-center space-x-4">
            {/* Quick actions */}
            <div className="hidden md:flex items-center space-x-2">
              {/* Add transaction button */}
              <button 
                onClick={() => router.push('/transactions/add')}
                className="btn-primary text-sm px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Expense
              </button>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <Bell className="h-6 w-6" />
              {/* Notification badge */}
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {user?.profilePicture ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user.profilePicture}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-500">
                    Free Plan
                  </div>
                </div>
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                  {/* User info */}
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Settings
                    </Link>
                    <Link
                      href="/billing"
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <CreditCard className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Billing
                    </Link>
                    <Link
                      href="/analytics"
                      className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <BarChart3 className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      Analytics
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      disabled={isLoading}
                      className="group flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <LogOut className="mr-3 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                      {isLoading ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {/* Mobile search */}
            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Search transactions..."
                />
              </div>
            </div>

            {/* Mobile add button */}
            <button 
              onClick={() => {
                router.push('/transactions/add');
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <Plus className="inline-block h-5 w-5 mr-2" />
              Add Transaction
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
}
