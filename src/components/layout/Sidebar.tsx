'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard,
  CreditCard,
  BarChart3,
  PieChart,
  TrendingUp,
  Settings,
  User,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
  Target,
  Wallet,
  Receipt,
  Calendar,
  Tag,
  Shield,
  Zap,
  Brain,
  Sparkles
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ============================================================================
// PREMIUM SIDEBAR NAVIGATION - Financial Command Center
// ============================================================================

// ✅ Fixed: Complete TypeScript interfaces
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  badge?: string | null;
  isHighlight?: boolean;
}

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

// Navigation configuration
const mainNavigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & insights',
    badge: null,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
    description: 'Income & expenses',
    badge: null,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Financial reports',
    badge: 'New',
    isHighlight: true,
  },
  {
    name: 'Budgets',
    href: '/budgets',
    icon: Target,
    description: 'Spending limits',
    badge: null,
  },
  {
    name: 'Investments',
    href: '/investments',
    icon: TrendingUp,
    description: 'Portfolio tracking',
    badge: 'Pro',
    isHighlight: false,
  },
  {
    name: 'Bills',
    href: '/bills',
    icon: Calendar,
    description: 'Recurring payments',
    badge: null,
  },
];

const aiFeatures: NavigationItem[] = [
  {
    name: 'AI Insights',
    href: '/ai-insights',
    icon: Brain,
    description: 'Smart recommendations',
    badge: 'Smart',
    isHighlight: true,
  },
  {
    name: 'Tax Assistant',
    href: '/tax-assistant',
    icon: Receipt,
    description: 'Deduction finder',
    badge: 'New',
    isHighlight: true,
  },
  {
    name: 'Financial Goals',
    href: '/goals',
    icon: Sparkles,
    description: 'AI-powered planning',
    badge: null,
  },
];

const bottomNavigation: NavigationItem[] = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App preferences',
    badge: null,
  },
  {
    name: 'Support',
    href: '/support',
    icon: HelpCircle,
    description: 'Help & feedback',
    badge: null,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'Account settings',
    badge: null,
  },
];

// Navigation item component
const NavItem = ({ 
  item, 
  isCollapsed = false, 
  isBottom = false 
}: { 
  item: NavigationItem; 
  isCollapsed?: boolean; 
  isBottom?: boolean; 
}) => {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  const handleClick = (e: React.MouseEvent) => {
    if (item.href.startsWith('/') && !item.href.includes('dashboard') && !item.href.includes('transactions')) {
      e.preventDefault();
      toast.success(`${item.name} feature coming soon! 🚀`);
    }
  };

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      className={`
        group relative flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }
        ${isCollapsed ? 'justify-center' : ''}
      `}
    >
      <item.icon className={`
        flex-shrink-0 h-5 w-5 transition-colors duration-200
        ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}
      `} />
      
      {!isCollapsed && (
        <>
          <span className="ml-3 truncate">{item.name}</span>
          
          {item.badge && (
            <span className={`
              ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
              ${isActive 
                ? 'bg-white/20 text-white' 
                : item.badge === 'New' 
                  ? 'bg-blue-100 text-blue-700'
                  : item.badge === 'Pro'
                    ? 'bg-purple-100 text-purple-700'
                    : item.badge === 'Smart'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-700'
              }
            `}>
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          <div className="flex items-center">
            <span>{item.name}</span>
            {item.badge && (
              <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                {item.badge}
              </span>
            )}
          </div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </Link>
  );
};

// Quick action button
const QuickActionButton = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <Link
    href="/transactions/add"
    className="flex items-center justify-center w-full px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium text-sm hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
  >
    <Plus className="h-4 w-4" />
    {!isCollapsed && <span className="ml-2">Add Transaction</span>}
  </Link>
);

// Main Sidebar component
export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const [balance] = useState(12450.75);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className={`
      relative flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              💰
            </div>
            <div className="ml-3">
              <div className="text-lg font-bold text-gray-900">AI Finance</div>
              <div className="text-xs text-gray-500">Smart Money Management</div>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mx-auto">
            💰
          </div>
        )}
        
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Balance Card */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                Total Balance
              </span>
              <button
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="text-gray-400 hover:text-gray-600"
              >
                {isBalanceVisible ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {isBalanceVisible ? formatCurrency(balance) : '••••••'}
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">+12.3% this month</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action */}
      <div className="px-4 mb-4">
        <QuickActionButton isCollapsed={isCollapsed} />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="px-3 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Main
              </h3>
            </div>
          )}
          {mainNavigation.map((item) => (
            <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>

        {/* AI Features */}
        <div className="px-3 mt-6 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                AI Powered
              </h3>
            </div>
          )}
          {aiFeatures.map((item) => (
            <NavItem key={item.name} item={item} isCollapsed={isCollapsed} />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        {bottomNavigation.map((item) => (
          <NavItem key={item.name} item={item} isCollapsed={isCollapsed} isBottom />
        ))}
        
        {/* Logout Button */}
        <button
          onClick={() => toast.success('Logout feature coming soon!')}
          className={`
            group w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut className="flex-shrink-0 h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Sign out</span>}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              Sign out
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          )}
        </button>
      </div>

      {/* Pro Upgrade Banner */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-4 text-white">
            <div className="flex items-center mb-2">
              <Shield className="h-5 w-5 mr-2" />
              <span className="font-semibold text-sm">Upgrade to Pro</span>
            </div>
            <p className="text-xs opacity-90 mb-3">
              Unlock advanced AI insights and unlimited transactions
            </p>
            <button
              onClick={() => toast.success('Pro upgrade coming soon! 🚀')}
              className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200"
            >
              Upgrade Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
