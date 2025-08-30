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
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Food & Dining': '#ef4444',
    'Transportation': '#3b82f6',
    'Shopping': '#8b5cf6',
    'Entertainment': '#f59e0b',
    'Bills & Utilities': '#10b981',
    'Healthcare': '#ec4899',
    'Education': '#6366f1',
    'Travel': '#14b8a6',
    'Business Expenses': '#84cc16',
    'Income': '#22c55e',
    'Investment': '#06b6d4',
    'Transfer': '#64748b',
    'Other': '#9ca3af',
  };
  return colors[category] || '#9ca3af';
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Types
interface Transaction {
  _id: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  date: string;
  paymentMethod?: string;
  source?: string;
  isTaxDeductible?: boolean;
}

interface TransactionFilters {
  search?: string;
  category?: string;
  type?: string;
  datePreset?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

// Pagination Component
const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    page === currentPage
                      ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

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
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTransactions: Transaction[] = [
        { 
          _id: '1', 
          description: 'Salary Deposit', 
          amount: 2600.00, 
          category: 'Income', 
          date: '2025-08-30', 
          type: 'income',
          paymentMethod: 'direct_deposit',
          source: 'Company Inc.',
          isTaxDeductible: false
        },
        { 
          _id: '2', 
          description: 'Grocery Shopping - Whole Foods', 
          amount: -89.50, 
          category: 'Food & Dining', 
          date: '2025-08-30', 
          type: 'expense',
          paymentMethod: 'credit_card',
          source: 'Chase Sapphire',
          isTaxDeductible: false
        },
        { 
          _id: '3', 
          description: 'Netflix Subscription', 
          amount: -15.99, 
          category: 'Entertainment', 
          date: '2025-08-29', 
          type: 'expense',
          paymentMethod: 'credit_card',
          source: 'Auto-pay',
          isTaxDeductible: false
        },
        { 
          _id: '4', 
          description: 'Uber Ride to Airport', 
          amount: -45.30, 
          category: 'Transportation', 
          date: '2025-08-29', 
          type: 'expense',
          paymentMethod: 'credit_card',
          source: 'Chase Sapphire',
          isTaxDeductible: true
        },
        { 
          _id: '5', 
          description: 'Freelance Project Payment', 
          amount: 500.00, 
          category: 'Income', 
          date: '2025-08-28', 
          type: 'income',
          paymentMethod: 'bank_transfer',
          source: 'Client ABC',
          isTaxDeductible: false
        },
      ];
      
      setTransactions(mockTransactions);
      setTotalPages(Math.ceil(mockTransactions.length / ITEMS_PER_PAGE));
      setTotalCount(mockTransactions.length);
      toast.success('Transactions loaded successfully!');
      
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
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
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
            {formatDate(transaction.date)}
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
                    onClick={() => {
                      toast.success('Edit feature coming soon!');
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Transaction
                  </button>
                  
                  <button
                    onClick={() => {
                      handleCopy();
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Details
                  </button>
                  
                  <button
                    onClick={() => {
                      toast.success('View details feature coming soon!');
                      setShowActions(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  <hr className="my-1" />
                  
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowActions(false);
                    }}
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
            {totalCount} transactions • {filters.datePreset?.replace('_', ' ')}
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
          
          <button 
            onClick={() => toast.success('Export feature coming soon!')}
            className="btn-secondary text-sm"
          >
            <Download className="h-4 w-4 mr-1" />
            Export
          </button>
          
          <button 
            onClick={() => toast.success('Add transaction feature coming soon!')}
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
                <button 
                  onClick={() => toast.success('Export selected feature coming soon!')}
                  className="btn-secondary text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export Selected
                </button>
                <button 
                  onClick={() => toast.success('Delete selected feature coming soon!')}
                  className="btn-danger text-sm"
                >
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
                      <p className="text-sm">Try adjusting your filters or add a new transaction.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map(transaction => (
                  <TransactionRow key={transaction._id} transaction={transaction} />
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
