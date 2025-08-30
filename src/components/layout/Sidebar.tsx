'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CreditCard, 
  BarChart3, 
  Settings, 
  PlusCircle,
  TrendingUp,
  Receipt,
  Target,
  Bell,
  HelpCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// ============================================================================
// PREMIUM SIDEBAR - Museum-Quality Navigation
// ============================================================================

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Your financial overview',
    badge: null,
  },
  {
    name: 'Transactions',
    href: '/transactions',
    icon: CreditCard,
    description: 'All your expenses & income',
    badge: null,
  },
  {
    name: 'Add Expense',
    href: '/transactions/add',
    icon: PlusCircle,
    description: 'Quick expense entry',
    badge: 'Quick',
    isHighlight: true,
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Deep insights & trends',
    badge: null,
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: Target,
    description: 'Financial targets',
    badge: null,
  },
  {
    name: 'Receipts',
    href: '/receipts',
    icon: Receipt,
    description: 'Digital receipt storage',
    badge: null,
  },
];

const bottomNavigation = [
  {
    name: 'AI Insights',
    href: '/insights',
    icon: Sparkles,
    description: 'Personalized recommendations',
    badge: 'New',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App preferences',
    badge: null,
  },
  {
    name: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
    description: 'Get assistance',
    badge: null,
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NavItem = ({ 
    item, 
    isBottom = false 
  }: { 
    item: typeof navigationItems[0]; 
    isBottom?: boolean;
  }) => {
    const active = isActive(item.href);
    const isHovered = hoveredItem === item.name;

    return (
      <Link
        href={item.href}
        className={`
          group relative flex items-center rounded-xl transition-all duration-300 ease-out
          ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
          ${active 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
            : item.isHighlight
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-emerald-700 hover:from-green-100 hover:to-emerald-100 border border-emerald-200'
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }
          ${isHovered && !active ? 'transform translate```1' : ''}
        `}
        onMouseEnter={() => setHoveredItem(item.name)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {/* Icon with premium styling */}
        <div className={`
          flex-shrink-0 relative
          ${active ? 'text-white' : item.isHighlight ? 'text-emerald-600' : 'text-gray-500 group-hover:text-gray-700'}
        `}>
          <item.icon 
            className={`
              h-5 w-5 transition-all duration-300
              ${isHovered && !active ? 'scale-110' : ''}
              ${active ? 'drop-shadow-sm' : ''}
            `} 
          />
          
          {/* Micro-interaction glow */}
          {active && (
            <div className="absolute inset-0 h-5 w-5 rounded-full bg-white/20 animate-ping" />
          )}
        </div>

        {/* Label and description */}
        {!isCollapsed && (
          <div className="ml-3 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`
                text-sm font-medium truncate transition-all duration-200
                ${active ? 'text-white' : item.isHighlight ? 'text-emerald-700' : 'text-gray-700 group-hover:text-gray-900'}
              `}>
                {item.name}
              </p>
              
              {/* Badge */}
              {item.badge && (
                <span className={`
                  ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                  ${active 
                    ? 'bg-white/20 text-white' 
                    : item.badge === 'New```                      ? 'bg-blue-100 text-blue-700'
                      : item.badge === 'Quick'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-700'
                  }
                `}>
                  {item.badge}
                </span>
              )}
            </div>
            
            {/* Description */}
            <p className={`
              text-xs mt-0.5 truncate transition-all duration-200
              ${active ? 'text-white/80' : item.isHighlight ? 'text-emerald-600' : 'text-gray-500'}
            `}>
              {item.description}
            </p>
          </div>
        )}

        {/* Active indicator */}
        {active && (
          <div className="absolute -right-px top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
        )}

        {/* Tooltip for collapsed state */}
        {isCollapsed && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 transform group-hover:translate-x-1 whitespace-nowrap z-50">
            <div className="font-medium">{item.name}</div>
            <div className="text-xs text-gray-300">{item.description}</div>
            <div className="absolute```p-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className={`
      flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300 ease-out
      ${isCollapsed ? 'w-16' : 'w-64'}
    `}>
      {/* Header */}
      <div className={`
        flex items-center justify-between p-4 border-b border-gray-100
        ${isCollapsed ? 'px-3' : 'px-6'}
      `}>
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              💰
            </div>
            <div className="ml-3">
              <div className="text-lg font-bold text-gray-900">AI Finance</div>
              <div className="text-xs text-gray-500 -mt-1">Personal CFO</div>
            </div>
          </div>
        )}
        
        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Main navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navigationItems.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </div>

      {/* Bottom navigation */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        {bottomNavigation.map((item) => (
          <NavItem key={item.name} item={item} isBottom />
        ))}
      </div>

      {/* Upgrade prompt */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Unlock Pro Features
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  AI categorization, advanced analytics, and more```              </p>
                <button className="mt-3 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-medium py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-sm">
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
