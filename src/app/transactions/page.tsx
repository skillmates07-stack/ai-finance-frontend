'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  EyeOff,
  ArrowUpDown,
  Calendar,
  DollarSign,
  Tag,
  MoreHorizontal,
  Edit3,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { toast } from 'react-hot-toast';
import { transactionService, formatCurrency, getCategoryColor } from '@/services/api';
import { Transaction, TransactionFilters } from '@/types';

// ============================================================================
// PREMIUM TRANSACTIONS PAGE - Financial Data Command Center
// ============================================================================

const ITEMS_PER_PAGE = 20;

const FILTER_PRESETS = [
  { label: 'All Time', value: 'all' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'This Year', value: 'this_year' },
];

const CATEGORY_OPTIONS = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Business Expenses',
  'Income',
  'Investment',
  'Transfer',
  'Other'
];

export default function TransactionsPage() {
  const router = useRouter();
  
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filter state
  const [filters, setFilters] = useState<TransactionFilters>({
    search: '',
    category: '',
    type: '',
    datePreset: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    page: 1,
    limit: ITEMS_PER_PAGE,
  });

  // Load transactions when filters change
  useEffect(() => {
    loadTransactions();
  }, [filters, currentPage]);

  const loadTransactions = async () => {
    setIsLoading(true);
    
    try {
      // Calculate date range based on preset
      let startDate, endDate;
      const now = new Date();
      
      switch (filters.datePreset) {
        case 'this_month':
          startDate = format(startOfMonth(now), 'yyyy-MM-dd');
          endDate = format(endOfMonth(now), 'yyyy-MM-dd');
          break;
        case 'last_month':
          const lastMonth = subMonths(now, 1);
          startDate = format(startOfMonth(lastMonth), 'yyyy-MM-dd');
          endDate = format(endOfMonth(lastMonth), 'yyyy-MM-dd');
          break;
        case 'last_3_months':
          startDate = format(subMonths(now, 3), 'yyyy-MM-dd');
          endDate = format(now, 'yyyy-MM-dd');
          break;
        case 'this_year':
          startDate = format(new Date(now.getFullYear(), 0, 1), 'yyyy-MM-dd');
          endDate = format(now, 'yyyy-MM-dd');
          break;
        default:
          // All time - no date filters
          break;
      }

      const queryFilters: TransactionFilters = {
        ...filters,
        page: currentPage,
        startDate,
        endDate,
      };

      const response = await transactionService.getAll(queryFilters);
      
      setTransactions(response.transactions);
      setTotalPages(response.pagination.totalPages);
      setTotalCount(response.pagination.totalTransactions);
      
    } catch (error: any) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input with debounce
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof TransactionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle transaction selection
  const handleTransactionSelect = (transactionId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(tx => tx._id));
    }
  };

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    const totalExpenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
    return {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  // Transaction row component
  const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
    const [showActions, setShowActions] = useState(false);
    const isSelected = selectedTransactions.includes(transaction._id);
    
    const handleDelete = async () => {
      if (confirm('Are you sure you want to delete this transaction?')) {
        try {
          await transactionService.delete(transaction._id);
          toast.success('Transaction deleted successfully');
          loadTransactions();
        } catch (error) {
          toast.error('Failed to delete transaction');
        }
      }
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(
        `${transaction.description} - ${formatCurrency(transaction.amount)} - ${transaction.category}`
      );
      toast.success('Transaction details copied');
    };

    return (
      <tr 
        className={`
          border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150
          ${isSelected ? 'bg-blue-50' : ''}
        `}
      >
        {/* Checkbox */}
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleTransactionSelect(transaction._id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </td>

        {/* Date */}
        <td className="px-6 py-4 text-sm text-gray-900">
          <div className="font-medium">
            {format(parseISO(transaction.date), 'MMM dd')}
          </div>
          <div className="text-gray-500">
            {format(parseISO(transaction.date), 'yyyy')}
          </div>
        </td>

        {/* Description & Category */}
        <td className="px-6 py-4">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {transaction.description}
              </div>
              <div className="flex items-center mt-1">
                <span 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{ 
                    backgroundColor: getCategoryColor(transaction.category) + '20',
                    color: getCategoryColor(transaction.category)
                  }}
                >
                  {transaction.category}
                </span>
                {transaction.isTaxDeductible && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Tax Deductible
                  </span>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Payment Method */}
        <td className="px-6 py-4 text-sm text-gray-500">
          {transaction.paymentMethod?.replace('_', ' ').toUpperCase() || 'N/A'}
        </td>

        {/* Amount */}
        <td className="px-6 py-4 text-right">
          <div className={`text-sm font-semibold ${
            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}>
            {isBalanceVisible ? (
              <>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(Math.abs(transaction.amount))}
              </>
            ) : (
              '••••••'
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {transaction.source}
          </div>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 text-right">
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => router.push(`/transactions/${transaction._id}/edit`)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Transaction
                  </button>
                  
                  <button
                    onClick={handleCopy}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Details
                  </button>
                  
                  <button
                    onClick={() => router.push(`/transactions/${transaction._id}`)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  <hr className="my-1" />
                  
                  <button
                    onClick={handleDelete}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">
            {totalCount} transactions • {filters.datePreset.replace('_', ' ')}
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            className="btn-ghost text-sm"
          >
            {isBalanceVisible ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {isBalanceVisible ? 'Hide' : 'Show'} amounts
          </button>
          
          <button className="btn-secondary text-sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          
          <button 
            onClick={() => router.push('/transactions/add')}
            className="btn-primary text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-xl font-bold text-green-600">
                {isBalanceVisible ? formatCurrency(summary.totalIncome) : '••••••'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white">
              <DollarSign className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-xl font-bold text-red-600">
                {isBalanceVisible ? formatCurrency(summary.totalExpenses) : '••••••'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
              <ArrowUpDown className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Net Amount</p>
              <p className={`text-xl font-bold ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {isBalanceVisible ? formatCurrency(summary.netAmount) : '••••••'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white">
              <Tag className="h-5 w-5" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Transactions</p>
              <p className="text-xl font-bold text-gray-900">
                {summary.transactionCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                className="input pl-10"
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <select
              className="input"
              value={filters.datePreset || 'all'}
              onChange={(e) => handleFilterChange('datePreset', e.target.value)}
            >
              {FILTER_PRESETS.map(preset => (
                <option key={preset.value} value={preset.value}>
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="input"
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORY_OPTIONS.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="card overflow-hidden">
        {/* Bulk actions */}
        {selectedTransactions.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedTransactions.length} transaction{selectedTransactions.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button className="btn-secondary text-sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export Selected
                </button>
                <button className="btn-danger text-sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="loading-spinner mr-2"></div>
                      Loading transactions...
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                      <p className="text-sm">Try adjusting your filters or ad
