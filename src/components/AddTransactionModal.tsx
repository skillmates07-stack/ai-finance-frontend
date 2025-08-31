'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { X, DollarSign, Calendar, Tag, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  isExpense: boolean;
  merchant: string;
  userId: string;
  createdAt: string;
  isRecurring?: boolean;
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: (transaction: Transaction) => void;
}

export default function AddTransactionModal({ isOpen, onClose, onTransactionAdded }: AddTransactionModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as 'expense' | 'income',
    merchant: '',
    isRecurring: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Food & Dining',
    'Transportation', 
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Income',
    'Transfer',
    'Investment',
    'Education',
    'Travel',
    'Other'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 100) {
      newErrors.description = 'Description must be less than 100 characters';
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) > 999999.99) {
      newErrors.amount = 'Amount too large';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors and try again');
      return;
    }

    setIsLoading(true);

    try {
      // Create transaction object
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        description: formData.description.trim(),
        amount: formData.type === 'expense' 
          ? -Math.abs(parseFloat(formData.amount)) 
          : Math.abs(parseFloat(formData.amount)),
        category: formData.category,
        date: formData.date,
        isExpense: formData.type === 'expense',
        merchant: formData.merchant.trim() || formData.description.trim(),
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
        isRecurring: formData.isRecurring,
      };

      // Simulate API call delay (replace with real API call to MongoDB later)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For now, store in localStorage (you can replace this with MongoDB API call)
      const existingTransactions = JSON.parse(localStorage.getItem(`user_transactions_${user?.id}`) || '[]');
      const updatedTransactions = [newTransaction, ...existingTransactions];
      localStorage.setItem(`user_transactions_${user?.id}`, JSON.stringify(updatedTransactions));

      // Update parent component
      onTransactionAdded(newTransaction);
      
      // Success feedback
      toast.success(
        `${formData.type === 'expense' ? 'Expense' : 'Income'} of $${parseFloat(formData.amount).toFixed(2)} added successfully! 🎉`,
        { duration: 4000 }
      );
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        merchant: '',
        isRecurring: false,
      });
      setErrors({});
      
      onClose();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-slideIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add Transaction</h2>
                <p className="text-sm text-gray-600">Record your income or expense</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              disabled={isLoading}
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Transaction Type Toggle */}
          <div className="form-group">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('type', 'expense')}
                className={`relative p-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  formData.type === 'expense'
                    ? 'bg-red-600 text-white shadow-lg transform scale-[1.02]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center">
                  <span className="text-xl mr-2">💸</span>
                  Expense
                </div>
                {formData.type === 'expense' && (
                  <div className="absolute inset-0 rounded-xl bg-red-500 opacity-20 animate-pulse"></div>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('type', 'income')}
                className={`relative p-4 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  formData.type === 'income'
                    ? 'bg-green-600 text-white shadow-lg transform scale-[1.02]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={isLoading}
              >
                <div className="flex items-center justify-center">
                  <span className="text-xl mr-2">💰</span>
                  Income
                </div>
                {formData.type === 'income' && (
                  <div className="absolute inset-0 rounded-xl bg-green-500 opacity-20 animate-pulse"></div>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="e.g., Coffee at Starbucks, Monthly salary, etc."
                disabled={isLoading}
                maxLength={100}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {formData.description.length}/100
              </div>
            </div>
            {errors.description && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0.01"
                max="999999.99"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.amount ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            {errors.amount && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.amount}
              </p>
            )}
            {parseFloat(formData.amount) > 0 && !errors.amount && (
              <p className={`text-sm mt-2 flex items-center ${
                formData.type === 'expense' ? 'text-red-600' : 'text-green-600'
              }`}>
                {formData.type === 'expense' ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-1" />
                    This will decrease your balance by ${parseFloat(formData.amount).toFixed(2)}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    This will increase your balance by ${parseFloat(formData.amount).toFixed(2)}
                  </>
                )}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none ${
                  errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Choose a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isLoading}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            {errors.date && (
              <p className="text-red-600 text-sm mt-1 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Merchant (Optional) */}
          <div className="form-group">
            <label htmlFor="merchant" className="block text-sm font-semibold text-gray-700 mb-2">
              Merchant / Source <span className="text-gray-500 text-sm font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              id="merchant"
              value={formData.merchant}
              onChange={(e) => handleInputChange('merchant', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Starbucks, Amazon, Your Company, etc."
              disabled={isLoading}
              maxLength={50}
            />
          </div>

          {/* Recurring Toggle */}
          <div className="form-group">
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="isRecurring" className="block text-sm font-semibold text-gray-700">
                  Recurring Transaction
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Mark if this transaction repeats monthly
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleInputChange('isRecurring', !formData.isRecurring)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  formData.isRecurring ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                disabled={isLoading}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.isRecurring ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 font-semibold"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !formData.description || !formData.amount || !formData.category}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Adding...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {formData.type === 'expense' ? '💸' : '💰'} 
                  Add {formData.type === 'expense' ? 'Expense' : 'Income'}
                </div>
              )}
            </button>
          </div>
        </form>

        {/* Footer tip */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">💡 Pro tip:</span> The more transactions you add, the better our AI can predict your spending patterns and find saving opportunities!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
