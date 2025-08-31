'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
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
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  isExpense: boolean;
  merchant?: string;
  isRecurring?: boolean;
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
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const mockTransactions: Transaction[] = [
        { id: 1, description: 'Starbucks Coffee', amount: -5.45, category: 'Food & Dining', date: '2 hours ago', isExpense: true, merchant: 'Starbucks' },
        { id: 2, description: 'Salary Deposit', amount: 4250.00, category: 'Income', date: 'Today', isExpense: false, merchant: 'Tech Corp Inc' },
        { id: 3, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: 'Yesterday', isExpense: true, merchant: 'Netflix', isRecurring: true },
        { id: 4, description: 'Uber Ride', amount: -18.50, category: 'Transportation', date: 'Yesterday', isExpense: true, merchant: 'Uber' },
        { id: 5, description: 'Amazon Purchase', amount: -127.89, category: 'Shopping', date: '2 days ago', isExpense: true, merchant: 'Amazon.com' },
        { id: 6, description: 'Freelance Payment', amount: 850.00, category: 'Income', date: '3 days ago', isExpense: false, merchant: 'Client XYZ' },
      ];
      
      const mockInsights: AIInsight[] = [
        {
          id: 1,
          type: 'saving',
          title: 'Subscription Opportunity',
          description: 'Cancel 3 unused subscriptions to save $47/month',
          amount: 564,
          action: 'Review Subscriptions'
        },
        {
          id: 2,
          type: 'goal',
          title: 'Savings Goal Progress',
          description: 'You\'re ahead by $250 this month! Keep it up.',
          amount: 250
        },
        {
          id: 3,
          type: 'warning',
          title: 'Spending Alert',
          description: 'Food expenses up 23% vs last month',
          amount: 180,
          action: 'See Details'
        },
        {
          id: 4,
          type: 'opportunity',
          title: 'Investment Suggestion',
          description: 'Move $500 to high-yield savings for extra $2.50/month',
          amount: 30,
          action: 'Learn More'
        }
      ];
      
      setRecentTransactions(mockTransactions);
      setAiInsights(mockInsights);
    } catch (error: any) {
      console.error('Dashboard data loading error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample data for demo
  const demoData = {
    totalBalance: 24567.82,
    monthlyIncome: 8750.00,
    monthlyExpenses: 4320.15,
    savingsGoal: 50000,
    currentSavings: 38750,
    creditScore: 785,
    monthlyProgress: 12.3,
    netWorth: 145230.50,
  };

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
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center mb-2">
            <h1 className="text-4xl font-bold text-gray-900 mr-3">
              Good evening, Sarah! 👋
            </h1>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">All systems healthy</span>
            </div>
          </div>
          <p className="text-lg text-gray-600">
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
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl">
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
          isLarge={false}
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

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            icon={Plus}
            title="Add Expense"
            description="Quick entry"
            onClick={() => toast.success('Add expense feature coming soon! 🚀')}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-600">{recentTransactions.length} transactions this week</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </button>
              <Link href="/transactions" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
                View All
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
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
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg mr-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">AI Insights</h3>
                <p className="text-sm text-gray-600">{aiInsights.length} new recommendations</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
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
                      <button className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
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
    </div>
  );
}
