'use client';

import { useState, useEffect } from 'react';
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
  CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { transactionService, formatCurrency } from '@/services/api';
import { Transaction, AnalyticsData } from '@/types';

// ============================================================================
// DASHBOARD PAGE - The Financial Command Center
// ============================================================================

export default function DashboardPage() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Fetch analytics and recent transactions
      const [analytics, transactions] = await Promise.all([
        transactionService.getAnalytics(),
        transactionService.getAll({ limit: 5, sortBy: 'date', sortOrder: 'desc' })
      ]);
      
      setAnalyticsData(analytics);
      setRecentTransactions(transactions.transactions);
    } catch (error: any) {
      console.error('Dashboard data loading error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample data for demo (replace with real data)
  const demoData = {
    totalBalance: 12450.75,
    monthlyIncome: 5200.00,
    monthlyExpenses: 3750.25,
    savingsGoal: 15000,
    currentSavings: 8500,
  };

  const SpendingCard = ({ 
    title, 
    amount, 
    change, 
    isPositive, 
    icon: Icon, 
    gradient 
  }: {
    title: string;
    amount: number;
    change: string;
    isPositive: boolean;
    icon: any;
    gradient: string;
  }) => (
    <div className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <div className="flex items-center mt-2">
            <p className={`text-2xl font-bold ${isBalanceVisible ? 'text-gray-900' : 'text-gray-400'}`}>
              {isBalanceVisible ? formatCurrency(amount) : '••••••'}
            </p>
          </div>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ml-1 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-xs text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        
        <div className={`h-12 w-12 rounded-xl ${gradient} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ 
    icon: Icon, 
    title, 
    description, 
    onClick, 
    gradient,
    isHighlight = false 
  }: {
    icon: any;
    title: string;
    description: string;
    onClick: () => void;
    gradient: string;
    isHighlight?: boolean;
  }) => (
    <button
      onClick={onClick}
      className={`
        card text-left group hover:shadow-xl transition-all duration-300 hover:-translate-y-1
        ${isHighlight ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
      `}
    >
      <div className="flex items-center">
        <div className={`h-10 w-10 rounded-lg ${gradient} flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-600 mt-0.5">{description}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
      </div>
    </button>
  );

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Good morning, Sarah! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your financial overview for today
          </p>
        </div>
        
        <div className="flex items-center mt-4 md:mt-0 space-x-3">
          {/* Balance visibility toggle */}
          <button
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="btn-ghost text-sm"
          >
            {isBalanceVisible ? (
              <EyeOff className="h-4 w-4 mr-1" />
            ) : (
              <Eye className="h-4 w-4 mr-1" />
            )}
            {isBalanceVisible ? 'Hide' : 'Show'} balances
          </button>
          
          {/* Export button */}
          <button className="btn-secondary text-sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
        </div>
      </div>

      {/* Key metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SpendingCard
          title="Total Balance"
          amount={demoData.totalBalance}
          change="+12.3%"
          isPositive={true}
          icon={DollarSign}
          gradient="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        
        <SpendingCard
          title="Monthly Income"
          amount={demoData.monthlyIncome}
          change="+8.2%"
          isPositive={true}
          icon={TrendingUp}
          gradient="bg-gradient-to-r from-green-500 to-green-600"
        />
        
        <SpendingCard
          title="Monthly Expenses"
          amount={demoData.monthlyExpenses}
          change="-5.4%"
          isPositive={false}
          icon={TrendingDown}
          gradient="bg-gradient-to-r from-red-500 to-red-600"
        />
      </div>

      {/* Savings goal progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Savings Goal</h3>
            <p className="text-sm text-gray-600">Emergency fund target</p>
          </div>
          <Target className="h-6 w-6 text-blue-500" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              {formatCurrency(demoData.currentSavings)} of {formatCurrency(demoData.savingsGoal)}
            </span>
            <span className="text-sm text-blue-600 font-semibold">
              {Math.round((demoData.currentSavings / demoData.savingsGoal) * 100)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${(demoData.currentSavings / demoData.savingsGoal) * 100}%` }}
            />
          </div>
          
          <p className="text-xs text-gray-600">
            Only {formatCurrency(demoData.savingsGoal - demoData.currentSavings)} left to reach your goal! 🎯
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAction
          icon={Plus}
          title="Add Expense"
          description="Quick entry"
          onClick={() => {}}
          gradient="bg-gradient-to-r from-green-500 to-emerald-600"
          isHighlight={true}
        />
        
        <QuickAction
          icon={Zap}
          title="AI Categorize"
          description="Smart sorting"
          onClick={() => {}}
          gradient="bg-gradient-to-r from-purple-500 to-pink-600"
        />
        
        <QuickAction
          icon={CreditCard}
          title="Link Bank"
          description="Auto-sync"
          onClick={() => {}}
          gradient="bg-gradient-to-r from-blue-500 to-indigo-600"
        />
        
        <QuickAction
          icon={Calendar}
          title="Monthly Report"
          description="View insights"
          onClick={() => {}}
          gradient="bg-gradient-to-r from-orange-500 to-red-600"
        />
      </div>

      {/* Recent transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <p className="text-sm text-gray-600">Your latest financial activity</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="btn-ghost text-sm">
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </button>
            <button className="btn-primary text-sm">
              View All
            </button>
          </div>
        </div>

        {/* Transaction list */}
        <div className="space-y-3">
          {[
            { id: 1, description: 'Starbucks Coffee', amount: -5.45, category: 'Food & Dining', date: 'Today', isExpense: true },
            { id: 2, description: 'Uber Ride', amount: -12.30, category: 'Transportation', date: 'Today', isExpense: true },
            { id: 3, description: 'Salary Deposit', amount: 2600.00, category: 'Income', date: 'Yesterday', isExpense: false },
            { id: 4, description: 'Netflix Subscription', amount: -15.99, category: 'Entertainment', date: 'Yesterday', isExpense: true },
            { id: 5, description: 'Amazon Purchase', amount: -89.99, category: 'Shopping', date: '2 days ago', isExpense: true },
          ].map((transaction) => (
            <div key={transaction.id} className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm ${
                transaction.isExpense 
                  ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600'
              }`}>
                {transaction.isExpense ? '−' : '+'}
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.description}
                  </p>
                  <p className={`text-sm font-semibold ${
                    transaction.isExpense ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                    {transaction.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {transaction.date}
                  </span>
                </div>
              </div>
              
              <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2" />
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights card */}
      <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 AI Insights</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">
                • You're spending 23% more on food this month. Consider meal planning to save ~$180
              </p>
              <p className="text-sm text-gray-700">
                • Your Uber expenses increased 45%. You could save $120/month with a monthly transit pass
              </p>
              <p className="text-sm text-gray-700">
                • Great job! You're on track to exceed your savings goal by $250 this month 🎉
              </p>
            </div>
            
            <button className="mt-4 btn-primary text-sm">
              View All Insights
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
