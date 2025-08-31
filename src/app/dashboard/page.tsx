'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import AddTransactionModal from '@/components/AddTransactionModal'; // NEW IMPORT
import { 
  ArrowLeft,
  LogOut,
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  Zap,
  Target,
  CreditCard,
  Brain,
  Award,
  Bell,
  Settings,
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  PieChart,
  BarChart3,
  RefreshCw,
  User,
  Loader2,
  AlertCircle
} from 'lucide-react';

// ============================================================================
// BILLION-DOLLAR DASHBOARD - AI FINANCE COMMAND CENTER
// ============================================================================

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface Transaction {
  id: string; // Changed to string for better compatibility
  description: string;
  amount: number;
  category: string;
  date: string;
  isExpense: boolean;
  merchant?: string;
  isRecurring?: boolean;
  userId: string; // NEW: Added user association
  createdAt: string; // NEW: Added timestamp
}

interface AIInsight {
  id: number;
  type: 'saving' | 'warning' | 'goal' | 'opportunity';
  title: string;
  description: string;
  amount?: number;
  action?: string;
}

export default function DashboardPage() {
  const { user, logout, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  
  // NEW: Add Transaction Modal State
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

  // Protect the route - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please sign in to access your dashboard');
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Load dashboard data including real user transactions
  useEffect(() => {
    if (isAuthenticated && user) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Load user-specific transactions from localStorage (later replace with MongoDB API)
      const userTransactions = JSON.parse(localStorage.getItem(`user_transactions_${user?.id}`) || '[]');
      
      // If no user transactions, add welcome bonus
      if (userTransactions.length === 0) {
        const welcomeTransaction: Transaction = {
          id: `welcome_${user?.id}`,
          description: 'Welcome to AI Finance! 🎉',
          amount: 100.00,
          category: 'Income',
          date: new Date().toISOString().split('T')[0],
          isExpense: false,
          merchant: 'AI Finance',
          userId: user?.id || '',
          createdAt: new Date().toISOString(),
        };
        
        const updatedTransactions = [welcomeTransaction];
        localStorage.setItem(`user_transactions_${user?.id}`, JSON.stringify(updatedTransactions));
        setRecentTransactions(updatedTransactions);
      } else {
        // Sort transactions by creation date and show recent ones
        const sortedTransactions = userTransactions
          .sort((a: Transaction, b: Transaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);
        setRecentTransactions(sortedTransactions);
      }
      
      // Dynamic AI insights based on transaction count
      const mockInsights: AIInsight[] = userTransactions.length === 0 ? [
        {
          id: 1,
          type: 'goal',
          title: 'Welcome to AI Finance!',
          description: 'Start by adding your first transaction to unlock AI-powered insights',
          action: 'Add Transaction'
        },
        {
          id: 2,
          type: 'opportunity',
          title: 'Setup Complete',
          description: 'Your account is ready. Connect your bank account for automatic transaction sync',
          action: 'Link Bank Account'
        }
      ] : [
        {
          id: 1,
          type: 'saving',
          title: 'Great Progress!',
          description: `You've added ${userTransactions.length} transactions. Our AI is learning your spending patterns`,
          action: 'View Analytics'
        },
        {
          id: 2,
          type: 'goal',
          title: 'Savings Opportunity',
          description: 'Based on your spending, you could save an extra $150/month with smart budgeting',
          amount: 150,
          action: 'See Details'
        },
        {
          id: 3,
          type: 'warning',
          title: 'Spending Insight',
          description: 'Your largest expense category this month helps us optimize your budget',
          action: 'Review Categories'
        }
      ];
      
      setAiInsights(mockInsights);
    } catch (error: any) {
      console.error('Dashboard data loading error:', error);
      toast.error('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Handle transaction added from modal
  const handleTransactionAdded = (newTransaction: Transaction) => {
    // Add to the beginning of the list
    setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);
    
    // Update AI insights based on transaction count
    const newCount = recentTransactions.length + 1;
    if (newCount >= 3) {
      setAiInsights(prev => [
        {
          id: Date.now(),
          type: 'goal',
          title: 'Building momentum! 🚀',
          description: `You've added ${newCount} transactions. Our AI is getting smarter about your spending!`,
          action: 'View Insights'
        },
        ...prev.slice(0, 2)
      ]);
    }
    
    // Refresh data to get updated totals
    setTimeout(() => loadDashboardData(), 500);
  };

  // Calculate real totals from user transactions
  const calculateUserStats = () => {
    const income = recentTransactions
      .filter(t => !t.isExpense)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const expenses = recentTransactions
      .filter(t => t.isExpense)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    return {
      totalBalance: income - expenses,
      monthlyIncome: income,
      monthlyExpenses: expenses,
      transactionCount: recentTransactions.length,
    };
  };

  const userStats = calculateUserStats();

  // Sample data for demo (enhanced with real user data)
  const demoData = {
    totalBalance: userStats.totalBalance + 24467.82, // Add demo base amount
    monthlyIncome: userStats.monthlyIncome || 8750.00,
    monthlyExpenses: userStats.monthlyExpenses || 4320.15,
    savingsGoal: 50000,
    currentSavings: 38750 + Math.max(0, userStats.totalBalance),
    creditScore: 785,
    monthlyProgress: 12.3,
    netWorth: 145230.50 + userStats.totalBalance,
  };

  const handleLogout = () => {
    logout();
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect screen (will redirect via useEffect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const MetricCard = ({ 
    title, 
    amount, 
    change, 
    isPositive, 
    icon: Icon, 
    gradient,
    subtitle,
    isLarge = false
  }: {
    title: string;
    amount: number;
    change: string;
    isPositive: boolean;
    icon: any;
    gradient: string;
    subtitle?: string;
    isLarge?: boolean;
  }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${isLarge ? 'md:col-span-2' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {isLarge && (
              <button
                onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={isBalanceVisible ? 'Hide balance' : 'Show balance'}
              >
                {isBalanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            )}
          </div>
          <div className="space-y-1">
            <p className={`${isLarge ? 'text-4xl' : 'text-2xl'} font-bold ${isBalanceVisible ? 'text-gray-900' : 'text-gray-400'}`}>
              {isBalanceVisible ? formatCurrency(amount) : '••••••'}
            </p>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center mt-3">
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ml-1 font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        
        <div className={`h-16 w-16 rounded-2xl ${gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );

  const QuickActionButton = ({ 
    icon: Icon, 
    title, 
    description, 
    onClick, 
    gradient,
    isHighlight = false,
    comingSoon = false
  }: {
    icon: any;
    title: string;
    description: string;
    onClick: () => void;
    gradient: string;
    isHighlight?: boolean;
    comingSoon?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden
        ${isHighlight ? 'ring-2 ring-blue-500 ring-opacity-30' : ''}
      `}
    >
      {comingSoon && (
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Soon
          </span>
        </div>
      )}
      <div className="flex items-center">
        <div className={`h-10 w-10 rounded-lg ${gradient} flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-300`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600 mt-0.5">{description}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
      </div>
    </button>
  );

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="flex space-x-3">
              <div className="h-10 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 bg-gray-200 rounded-2xl"></div>
            <div className="h-80 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* Dashboard Navigation Header */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Home
          </Link>
          <div className="h-4 w-px bg-gray-300"></div>
          <Link 
            href="/" 
            className="flex items-center text-gray-900"
          >
            <div className="h-6 w-6 rounded bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-2">
              💰
            </div>
            <span className="font-semibold">AI Finance</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.plan || 'Free'} Plan</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 transition-colors duration-200 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </button>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center mb-2">
            <h1 className="text-4xl font-bold text-gray-900 mr-3">
              Good evening, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">All systems healthy</span>
            </div>
          </div>
          <p className="text-lg text-gray-600">
            You have <span className="font-semibold text-blue-600">{userStats.transactionCount}</span> transactions • 
            Your wealth grew by <span className="font-semibold text-green-600">+{demoData.monthlyProgress}%</span> this month
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSelectedPeriod(selectedPeriod === '30d' ? '7d' : '30d')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {selectedPeriod === '30d' ? 'Last 30 days' : 'Last 7 days'}
          </button>
          
          <button
            onClick={() => loadDashboardData()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button 
            onClick={() => toast.success('Export feature coming soon! 📊')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Net Worth"
          amount={demoData.netWorth}
          change="+15.2%"
          isPositive={true}
          icon={Award}
          gradient="bg-gradient-to-r from-purple-500 to-purple-600"
          subtitle="All accounts combined"
        />
        
        <MetricCard
          title="Liquid Assets"
          amount={demoData.totalBalance}
          change="+12.3%"
          isPositive={true}
          icon={DollarSign}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
          subtitle="Available balance"
        />
        
        <MetricCard
          title="Monthly Income"
          amount={demoData.monthlyIncome}
          change="+8.2%"
          isPositive={true}
          icon={TrendingUp}
          gradient="bg-gradient-to-r from-green-500 to-green-600"
          subtitle="This month"
        />
        
        <MetricCard
          title="Monthly Expenses"
          amount={demoData.monthlyExpenses}
          change="-5.4%"
          isPositive={true}
          icon={CreditCard}
          gradient="bg-gradient-to-r from-red-500 to-red-600"
          subtitle="This month"
        />
      </div>

      {/* Savings Goal & Credit Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Goal Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Emergency Fund Goal</h3>
              <p className="text-sm text-gray-600">Building financial security</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                {formatCurrency(demoData.currentSavings)} of {formatCurrency(demoData.savingsGoal)}
              </span>
              <span className="text-lg font-bold text-blue-600">
                {Math.round((demoData.currentSavings / demoData.savingsGoal) * 100)}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ width: `${(demoData.currentSavings / demoData.savingsGoal) * 100}%` }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Only {formatCurrency(demoData.savingsGoal - demoData.currentSavings)} left to reach your goal!
              </p>
              <span className="text-sm font-medium text-green-600">🎯 On track</span>
            </div>
          </div>
        </div>

        {/* Credit Score */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Credit Score</h3>
              <p className="text-sm text-gray-600">Excellent standing</p>
            </div>
            <div className="h-8 w-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke="url(#gradient)" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray="351.86"
                  strokeDashoffset={351.86 - (demoData.creditScore / 850) * 351.86}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{demoData.creditScore}</span>
              </div>
            </div>
            <p className="text-sm text-green-600 font-semibold">Excellent Credit</p>
            <p className="text-xs text-gray-500 mt-1">Updated 2 days ago</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - UPDATED with working Add Transaction */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            icon={Plus}
            title="Add Transaction"
            description="Record income/expense"
            onClick={() => setIsAddTransactionModalOpen(true)} // NEW: Opens working modal
            gradient="bg-gradient-to-r from-green-500 to-emerald-600"
            isHighlight={true}
          />
          
          <QuickActionButton
            icon={Brain}
            title="AI Analysis"
            description="Smart insights"
            onClick={() => toast.success('AI analysis feature coming soon! 🤖')}
            gradient="bg-gradient-to-r from-purple-500 to-pink-600"
            comingSoon={true}
          />
          
          <QuickActionButton
            icon={CreditCard}
            title="Link Account"
            description="Auto-sync"
            onClick={() => toast.success('Bank linking coming soon! 🏦')}
            gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
            comingSoon={true}
          />
          
          <QuickActionButton
            icon={PieChart}
            title="Full Report"
            description="View analytics"
            onClick={() => toast.success('Analytics feature coming soon! 📊')}
            gradient="bg-gradient-to-r from-orange-500 to-red-600"
            comingSoon={true}
          />
        </div>
      </div>

      {/* Main Content Grid - UPDATED with real transaction data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-600">
                {recentTransactions.length > 0 
                  ? `${recentTransactions.length} transactions total`
                  : 'No transactions yet'
                }
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => toast.success('Filter feature coming soon! 🔍')}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
              <button 
                onClick={() => toast.success('View all transactions coming soon! 📝')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                View All
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h4>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Start tracking your finances by adding your first transaction. Our AI will learn from your spending patterns!
                </p>
                <button
                  onClick={() => setIsAddTransactionModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Your First Transaction
                </button>
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group cursor-pointer">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-sm ${
                    transaction.isExpense 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600'
                  }`}>
                    {transaction.isExpense ? '−' : '+'}
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 flex items-center">
                          {transaction.description}
                          {transaction.isRecurring && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Recurring
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{transaction.merchant} • {transaction.date}</p>
                      </div>
                      <p className={`text-sm font-bold ${
                        transaction.isExpense ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        {transaction.category}
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Insights - UPDATED with dynamic content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg mr-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">AI Insights</h3>
                <p className="text-sm text-gray-600">{aiInsights.length} recommendations</p>
              </div>
            </div>
            <button 
              onClick={() => toast.success('View all insights coming soon! 🧠')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                insight.type === 'saving' ? 'bg-green-50 border-green-200' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                insight.type === 'goal' ? 'bg-blue-50 border-blue-200' :
                'bg-purple-50 border-purple-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-xs text-gray-700 mb-2">{insight.description}</p>
                    {insight.amount && (
                      <p className={`text-sm font-bold ${
                        insight.type === 'saving' || insight.type === 'goal' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {insight.type === 'saving' || insight.type === 'opportunity' ? '+' : ''}{formatCurrency(insight.amount)}
                      </p>
                    )}
                    {insight.action && (
                      <button 
                        onClick={() => {
                          if (insight.action === 'Add Transaction') {
                            setIsAddTransactionModalOpen(true);
                          } else {
                            toast.success(`${insight.action} feature coming soon! 🎯`);
                          }
                        }}
                        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {insight.action} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        onClose={() => setIsAddTransactionModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  );
}
