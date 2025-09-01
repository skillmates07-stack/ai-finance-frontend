'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import type { Transaction, AIInsight, FinancialGoal } from '@/types';
import { 
  Plus,
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Target,
  CreditCard,
  Award,
  Eye,
  EyeOff,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  ChevronRight,
  Sparkles,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

/**
 * CONSUMER DASHBOARD - PERSONAL FINANCE OVERVIEW
 * 
 * This is the main dashboard for personal finance users. Features:
 * - Financial overview with key metrics
 * - Recent transactions with smart categorization
 * - AI-powered insights and recommendations
 * - Goal progress tracking
 * - Quick actions for common tasks
 * - Responsive design for all devices
 * - Real-time data updates
 */

export default function ConsumerDashboardPage() {
  const { user, hasFeature } = useAuth();
  const router = useRouter();
  
  // State management
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);

  // Load dashboard data on component mount
  useEffect(() => {
    loadDashboardData();
  }, [user?.id, selectedPeriod]);

  const loadDashboardData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API loading time
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Load user-specific data from localStorage (in production, this would be API calls)
      const userTransactions = JSON.parse(
        localStorage.getItem(`user_transactions_${user.id}`) || '[]'
      );
      const userGoals = JSON.parse(
        localStorage.getItem(`user_goals_${user.id}`) || '[]'
      );
      
      // Create welcome transaction if this is a new user
      if (userTransactions.length === 0) {
        const welcomeTransaction: Transaction = {
          id: `welcome_${user.id}_${Date.now()}`,
          userId: user.id,
          description: '🎉 Welcome to AI Finance!',
          amount: 100.00,
          category: 'Income',
          date: new Date().toISOString().split('T')[0],
          isExpense: false,
          merchant: 'AI Finance Platform',
          currency: 'USD',
          tags: ['welcome', 'bonus'],
          isRecurring: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          syncSource: 'manual',
          version: 1,
          aiCategory: 'Income',
          aiConfidence: 1.0,
          fraudScore: 0
        };
        
        const updatedTransactions = [welcomeTransaction];
        localStorage.setItem(`user_transactions_${user.id}`, JSON.stringify(updatedTransactions));
        setRecentTransactions(updatedTransactions);
      } else {
        setRecentTransactions(userTransactions.slice(0, 10));
      }
      
      setFinancialGoals(userGoals);
      
      // Generate AI insights based on user data and feature flags
      const insights = generateAIInsights(userTransactions, userGoals);
      setAiInsights(insights);
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI insights based on user data
  const generateAIInsights = (transactions: Transaction[], goals: FinancialGoal[]): AIInsight[] => {
    if (!user) return [];

    const insights: AIInsight[] = [];

    // Welcome insight for new users
    if (transactions.length <= 1) {
      insights.push({
        id: `insight_welcome_${user.id}`,
        userId: user.id,
        type: 'saving_opportunity',
        category: 'financial_health',
        title: hasFeature('AI_BUDGET_OPTIMIZER') ? 'AI-Powered Financial Analysis Ready' : 'Start Your Financial Journey',
        description: hasFeature('AI_BUDGET_OPTIMIZER') 
          ? 'Our AI is ready to analyze your spending patterns and find opportunities to save money. Add a few more transactions to unlock personalized insights.'
          : 'Begin tracking your expenses and income to get personalized financial insights. Upgrade to Pro to unlock AI-powered recommendations.',
        priority: 'high',
        urgency: 'medium',
        confidence: 1.0,
        modelVersion: 'v1.0',
        dataPoints: ['user_registration', 'account_type'],
        actionable: true,
        actionText: 'Add Transaction',
        dismissed: false,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    // Goal progress insight
    if (goals.length === 0) {
      insights.push({
        id: `insight_goals_${user.id}`,
        userId: user.id,
        type: 'goal_progress',
        category: 'saving',
        title: 'Set Your First Financial Goal',
        description: 'Goals are proven to help people save 3x more money. Start with an emergency fund or a specific savings target.',
        priority: 'medium',
        urgency: 'low',
        confidence: 0.95,
        modelVersion: 'v1.0',
        dataPoints: ['goal_count'],
        actionable: true,
        actionText: 'Create Goal',
        dismissed: false,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      const incompleteGoals = goals.filter(goal => goal.currentAmount < goal.targetAmount && goal.isActive);
      if (incompleteGoals.length > 0) {
        const closestGoal = incompleteGoals.sort((a, b) => 
          (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount)
        )[0];
        
        const progressPercent = Math.round((closestGoal.currentAmount / closestGoal.targetAmount) * 100);
        
        insights.push({
          id: `insight_goal_progress_${closestGoal.id}`,
          userId: user.id,
          type: 'goal_progress',
          category: 'saving',
          title: `You're ${progressPercent}% toward your ${closestGoal.name} goal!`,
          description: `Great progress! You need $${(closestGoal.targetAmount - closestGoal.currentAmount).toFixed(2)} more to reach your target.`,
          priority: progressPercent > 75 ? 'high' : 'medium',
          urgency: 'medium',
          confidence: 0.9,
          modelVersion: 'v1.0',
          dataPoints: ['goal_progress', 'target_amount'],
          actionable: true,
          actionText: 'Add to Goal',
          dismissed: false,
          isRead: false,
          createdAt: new Date().toISOString(),
        });
      }
    }

    // Investment opportunity insight for pro users
    if (hasFeature('INVESTMENT_TRACKING') && user.plan !== 'free') {
      insights.push({
        id: `insight_investment_${user.id}`,
        userId: user.id,
        type: 'investment_suggestion',
        category: 'investing',
        title: 'Your Investment Portfolio Awaits',
        description: 'Track stocks, crypto, and ETFs in one place. Start building wealth with our investment tracking tools.',
        priority: 'medium',
        urgency: 'low',
        confidence: 0.8,
        modelVersion: 'v1.0',
        dataPoints: ['feature_flags', 'user_plan'],
        actionable: true,
        actionText: 'Explore Investments',
        dismissed: false,
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return insights.slice(0, 3); // Show max 3 insights
  };

  // Calculate financial statistics
  const calculateStats = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentTransactionsInPeriod = recentTransactions.filter(t => 
      new Date(t.date) >= thirtyDaysAgo
    );
    
    const income = recentTransactionsInPeriod
      .filter(t => !t.isExpense)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const expenses = recentTransactionsInPeriod
      .filter(t => t.isExpense)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalGoalTarget = financialGoals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalGoalProgress = financialGoals.reduce((sum, g) => sum + g.currentAmount, 0);
    
    return {
      netWorth: 145230.50 + (income - expenses), // Simulated base net worth
      liquidAssets: 24567.82 + (income - expenses * 0.3),
      monthlyIncome: income || user?.monthlyIncome || 5000,
      monthlyExpenses: expenses || 3420.15,
      goalsProgress: totalGoalTarget > 0 ? (totalGoalProgress / totalGoalTarget) * 100 : 0,
      creditScore: user?.creditScore || 750,
      totalGoals: financialGoals.length,
      activeGoals: financialGoals.filter(g => g.isActive).length,
    };
  };

  const stats = calculateStats();
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your personal dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing your financial data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-lg text-gray-600 mt-1">
            You have {recentTransactions.length} transactions tracked • Last updated just now
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={loadDashboardData}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Net Worth Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600">Net Worth</p>
                <button
                  onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {isBalanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <p className={`text-3xl font-bold ${isBalanceVisible ? 'text-gray-900' : 'text-gray-400'}`}>
                {isBalanceVisible ? formatCurrency(stats.netWorth) : '••••••'}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-semibold text-green-600">+15.2%</span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Award className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Liquid Assets Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Available Cash</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.liquidAssets)}</p>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-semibold text-green-600">+12.3%</span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
              <DollarSign className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Monthly Income Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Monthly Income</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.monthlyIncome)}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-semibold text-green-600">+8.2%</span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
              <TrendingUp className="h-8 w-8" />
            </div>
          </div>
        </div>

        {/* Monthly Expenses Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Monthly Expenses</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.monthlyExpenses)}</p>
              <div className="flex items-center mt-2">
                <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-semibold text-green-600">-5.4%</span>
                <span className="text-xs text-gray-500 ml-1">Great job!</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg">
              <CreditCard className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/transactions/add"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 ring-2 ring-blue-500 ring-opacity-0 hover:ring-opacity-30 group"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-1 text-left">
                <h3 className="text-sm font-semibold text-gray-900">Add Transaction</h3>
                <p className="text-xs text-gray-600">Record income/expense</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </div>
          </Link>
          
          <Link
            href="/budgets"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <PieChart className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-1 text-left">
                <h3 className="text-sm font-semibold text-gray-900">Budgets</h3>
                <p className="text-xs text-gray-600">Track spending</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </div>
          </Link>

          <Link
            href="/goals"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Target className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-1 text-left">
                <h3 className="text-sm font-semibold text-gray-900">Goals</h3>
                <p className="text-xs text-gray-600">{stats.activeGoals} active</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </div>
          </Link>

          <Link
            href={hasFeature('INVESTMENT_TRACKING') ? '/investments' : '/pricing'}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 group relative"
          >
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="ml-3 flex-1 text-left">
                <h3 className="text-sm font-semibold text-gray-900">Investments</h3>
                <p className="text-xs text-gray-600">
                  {hasFeature('INVESTMENT_TRACKING') ? 'Track portfolio' : 'Upgrade to unlock'}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
            </div>
            {!hasFeature('INVESTMENT_TRACKING') && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold">
                PRO
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              <p className="text-sm text-gray-600">{recentTransactions.length} transactions • Updated now</p>
            </div>
            <Link 
              href="/transactions"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No transactions yet</h4>
                <p className="text-gray-500 mb-6">Start tracking your finances and unlock powerful insights!</p>
                <Link
                  href="/transactions/add"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add First Transaction
                </Link>
              </div>
            ) : (
              recentTransactions.map((transaction, index) => (
                <div key={transaction.id} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-sm ${
                    transaction.isExpense 
                      ? 'bg-gradient-to-r from-red-500 to-pink-600' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600'
                  }`}>
                    <span className="font-bold">
                      {transaction.isExpense ? '−' : '+'}
                    </span>
                  </div>
                  
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {transaction.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.merchant} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${
                          transaction.isExpense ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.isExpense ? '-' : '+'}
                          {formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        {transaction.aiCategory && (
                          <div className="flex items-center justify-end mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {transaction.aiCategory}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                        {transaction.category}
                      </span>
                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {transaction.tags.slice(0, 2).map((tag, tagIndex) => (
                            <span key={tagIndex} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-2 group-hover:text-blue-600" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-lg mr-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {hasFeature('AI_BUDGET_OPTIMIZER') ? 'AI Insights' : 'Smart Insights'}
              </h3>
              <p className="text-sm text-gray-600">{aiInsights.length} recommendations</p>
            </div>
          </div>

          <div className="space-y-4">
            {aiInsights.map((insight, index) => (
              <div key={insight.id} className={`p-4 rounded-xl border ${
                insight.priority === 'high' 
                  ? 'bg-blue-50 border-blue-200' 
                  : insight.priority === 'medium'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      {insight.priority === 'high' && <AlertTriangle className="h-4 w-4 text-blue-600 mr-1" />}
                      {insight.priority === 'medium' && <CheckCircle className="h-4 w-4 text-green-600 mr-1" />}
                      <h4 className="text-sm font-semibold text-gray-900">{insight.title}</h4>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{insight.description}</p>
                    
                    {insight.potentialSavings && (
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-xs font-medium text-green-700">
                          Save up to {formatCurrency(insight.potentialSavings)}
                        </span>
                      </div>
                    )}
                    
                    {insight.actionable && insight.actionText && (
                      <button 
                        onClick={() => {
                          if (insight.actionText === 'Add Transaction') {
                            router.push('/transactions/add');
                          } else if (insight.actionText === 'Create Goal') {
                            router.push('/goals');
                          } else if (insight.actionText === 'Explore Investments') {
                            router.push('/investments');
                          } else {
                            toast.success(`${insight.actionText} feature coming soon! 🎯`);
                          }
                        }}
                        className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {insight.actionText} →
                      </button>
                    )}
                    
                    {hasFeature('AI_BUDGET_OPTIMIZER') && (
                      <div className="flex items-center mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Confidence: {Math.round(insight.confidence * 100)}%
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Upgrade prompt for more insights */}
            {!hasFeature('AI_BUDGET_OPTIMIZER') && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center mb-2">
                  <Brain className="h-5 w-5 text-purple-600 mr-2" />
                  <h4 className="text-sm font-semibold text-purple-900">Unlock AI Power</h4>
                </div>
                <p className="text-xs text-purple-700 mb-3">
                  Get personalized AI insights, spending predictions, and smart recommendations.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center text-xs font-medium text-purple-600 hover:text-purple-800"
                >
                  Upgrade to Pro →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
