'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext'; // ADD THIS
import { toast } from 'react-hot-toast';
import { 
  Calculator, 
  Calendar, 
  Tag, 
  CreditCard, 
  Receipt, 
  Mic, 
  Camera,
  Sparkles,
  ArrowRight,
  Check,
  AlertTriangle,
  Upload,
  X,
  Save,
  ArrowLeft
} from 'lucide-react';

// Your existing interfaces remain the same...
interface TransactionFormData {
  amount: string;
  description: string;
  date: string;
  category: string;
  type: 'expense' | 'income';
  paymentMethod: string;
  isTaxDeductible: boolean;
  notes: string;
  tags: string | string[];
  receiptUrl?: string;
}

interface SmartSuggestion {
  category: string;
  isTaxDeductible: boolean;
  confidence: number;
  reasoning: string;
}

// Your existing constants remain the same...
const TRANSACTION_CATEGORIES = [
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

const PAYMENT_METHODS = [
  'credit_card',
  'debit_card',
  'cash',
  'bank_transfer',
  'digital_wallet',
  'check',
  'other'
];

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export default function AddTransactionPage() {
  const router = useRouter();
  const { user } = useAuth(); // ADD THIS
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [smartSuggestion, setSmartSuggestion] = useState<SmartSuggestion | null>(null);
  const [uploadedReceipt, setUploadedReceipt] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    defaultValues: {
      amount: '',
      description: '',
      date: formatDate(new Date()),
      category: 'Other',
      type: 'expense',
      paymentMethod: 'credit_card',
      isTaxDeductible: false,
      notes: '',
      tags: '',
    },
  });

  const watchedDescription = watch('description');
  const watchedAmount = watch('amount');
  const watchedType = watch('type');

  // Enhanced AI categorization
  useEffect(() => {
    if (watchedDescription && watchedDescription.length > 3) {
      generateSmartSuggestion(watchedDescription, parseFloat(watchedAmount?.toString() || '0'));
    } else {
      setSmartSuggestion(null);
    }
  }, [watchedDescription, watchedAmount]);

  const generateSmartSuggestion = async (description: string, amount: number) => {
    setTimeout(() => {
      const aiRules: Record<string, SmartSuggestion> = {
        'starbucks|coffee|cafe': {
          category: 'Food & Dining',
          isTaxDeductible: false,
          confidence: 0.95,
          reasoning: 'Coffee shop purchase detected'
        },
        'uber|lyft|taxi': {
          category: 'Transportation',
          isTaxDeductible: true,
          confidence: 0.90,
          reasoning: 'Business travel expense'
        },
        'amazon|shopping|store': {
          category: 'Shopping',
          isTaxDeductible: false,
          confidence: 0.85,
          reasoning: 'Online shopping detected'
        },
        'office|supplies|equipment|meeting': {
          category: 'Business Expenses',
          isTaxDeductible: true,
          confidence: 0.88,
          reasoning: 'Business expense detected'
        },
        'restaurant|food|meal|lunch|dinner': {
          category: 'Food & Dining',
          isTaxDeductible: false,
          confidence: 0.82,
          reasoning: 'Restaurant purchase detected'
        },
        'gas|fuel|station|gasoline': {
          category: 'Transportation',
          isTaxDeductible: false,
          confidence: 0.90,
          reasoning: 'Fuel purchase detected'
        },
        'netflix|spotify|subscription|streaming': {
          category: 'Entertainment',
          isTaxDeductible: false,
          confidence: 0.95,
          reasoning: 'Subscription service detected'
        },
        'rent|mortgage|utilities|electric|water': {
          category: 'Bills & Utilities',
          isTaxDeductible: false,
          confidence: 0.98,
          reasoning: 'Utility bill detected'
        },
        'medical|doctor|pharmacy|health': {
          category: 'Healthcare',
          isTaxDeductible: false,
          confidence: 0.92,
          reasoning: 'Healthcare expense detected'
        },
        'flight|hotel|travel|vacation': {
          category: 'Travel',
          isTaxDeductible: true,
          confidence: 0.87,
          reasoning: 'Travel expense detected'
        },
        'salary|wage|income|paycheck|bonus': {
          category: 'Income',
          isTaxDeductible: false,
          confidence: 0.95,
          reasoning: 'Income detected'
        }
      };

      const lowerDesc = description.toLowerCase();
      for (const [pattern, suggestion] of Object.entries(aiRules)) {
        if (new RegExp(pattern).test(lowerDesc)) {
          setSmartSuggestion(suggestion);
          toast.success(`🤖 AI suggests: ${suggestion.category}`, {
            duration: 3000,
          });
          return;
        }
      }
    }, 500);
  };

  // ENHANCED: Save to localStorage with user ID
  const onSubmit = async (data: TransactionFormData) => {
    setIsLoading(true);
    
    try {
      // Convert amount to number and make it negative for expenses
      const amount = data.type === 'expense' 
        ? -Math.abs(parseFloat(data.amount.toString()))
        : Math.abs(parseFloat(data.amount.toString()));

      // Create transaction object
      const newTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        description: data.description.trim(),
        amount,
        category: data.category,
        date: data.date,
        isExpense: data.type === 'expense',
        merchant: data.description.trim(),
        userId: user?.id || '',
        createdAt: new Date().toISOString(),
        paymentMethod: data.paymentMethod,
        isTaxDeductible: data.isTaxDeductible,
        notes: data.notes,
        tags: typeof data.tags === 'string' 
          ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : Array.isArray(data.tags) 
            ? data.tags 
            : [],
        receiptUrl: data.receiptUrl,
        isRecurring: false,
      };

      // Save to localStorage (later replace with MongoDB API)
      const existingTransactions = JSON.parse(localStorage.getItem(`user_transactions_${user?.id}`) || '[]');
      const updatedTransactions = [newTransaction, ...existingTransactions];
      localStorage.setItem(`user_transactions_${user?.id}`, JSON.stringify(updatedTransactions));

      console.log('Transaction saved:', newTransaction);
      
      toast.success(`${data.type === 'expense' ? 'Expense' : 'Income'} of $${Math.abs(amount).toFixed(2)} added successfully! 🎉`, {
        duration: 4000,
      });
      
      // Reset form and redirect
      reset();
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Failed to create transaction:', error);
      toast.error(error.message || 'Failed to create transaction');
    } finally {
      setIsLoading(false);
    }
  };

  // Your existing voice input function...
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    setIsVoiceRecording(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setValue('description', transcript);
      
      // Enhanced: Try to extract amount from voice input
      const amountMatch = transcript.match(/\$?(\d+\.?\d*)/);
      if (amountMatch) {
        setValue('amount', amountMatch[1]);
      }
      
      toast.success('Voice input captured! 🎤');
    };

    recognition.onerror = () => {
      toast.error('Voice recognition failed');
    };

    recognition.onend = () => {
      setIsVoiceRecording(false);
    };

    recognition.start();
  };

  // Enhanced receipt upload
  const handleReceiptUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedReceipt(file);
      toast.success('Receipt uploaded! Processing with AI... 🤖', { icon: '📄' });
      
      // Simulate advanced OCR processing
      setTimeout(() => {
        // Mock OCR data based on filename for demo
        const mockData = {
          description: file.name.toLowerCase().includes('starbucks') 
            ? 'Starbucks Coffee Purchase'
            : file.name.toLowerCase().includes('gas') 
              ? 'Gas Station Fill-up'
              : file.name.toLowerCase().includes('restaurant')
                ? 'Restaurant Dinner'
                : 'Receipt Purchase',
          amount: (Math.random() * 50 + 5).toFixed(2),
          category: file.name.toLowerCase().includes('starbucks') || file.name.toLowerCase().includes('restaurant')
            ? 'Food & Dining'
            : file.name.toLowerCase().includes('gas')
              ? 'Transportation'
              : 'Other',
          merchant: file.name.toLowerCase().includes('starbucks') 
            ? 'Starbucks'
            : 'Local Business'
        };
        
        setValue('description', mockData.description);
        setValue('amount', mockData.amount);
        setValue('category', mockData.category);
        toast.success('✨ Receipt processed! Data extracted automatically');
      }, 2000);
    }
  };

  const applySuggestion = () => {
    if (smartSuggestion) {
      setValue('category', smartSuggestion.category);
      setValue('isTaxDeductible', smartSuggestion.isTaxDeductible);
      setSmartSuggestion(null);
      toast.success('AI suggestion applied! 🎯');
    }
  };

  const dismissSuggestion = () => {
    setSmartSuggestion(null);
  };

  // Your existing JSX remains exactly the same, just add this at the top:
  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push('/dashboard')} // CHANGED: Always go back to dashboard
            className="btn-ghost mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add Transaction</h1>
            <p className="text-gray-600 mt-1">
              Add a new expense or income with AI-powered smart categorization
            </p>
          </div>
        </div>
      </div>

      {/* Rest of your existing JSX code stays exactly the same... */}
      {/* Smart AI Suggestion */}
      {smartSuggestion && (
        <div className="card mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-start">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🤖 AI Suggestion
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Category:</strong> {smartSuggestion.category}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Tax Deductible:</strong> {smartSuggestion.isTaxDeductible ? 'Yes' : 'No'}
                </p>
                <p className="text-xs text-gray-600">
                  {smartSuggestion.reasoning} • {Math.round(smartSuggestion.confidence * 100)}% confident
                </p>
              </div>
              
              <div className="flex items-center mt-4 space-x-2">
                <button
                  onClick={applySuggestion}
                  className="btn-primary text-sm"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Apply Suggestion
                </button>
                <button
                  onClick={dismissSuggestion}
                  className="btn-ghost text-sm"
                >
                  <X className="h-4 w-4 mr-1" />
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Input Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          type="button"
          onClick={handleVoiceInput}
          disabled={isVoiceRecording}
          className={`card text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
            isVoiceRecording ? 'bg-red-50 border-red-200' : ''
          }`}
        >
          <div className="flex items-center">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-md ${
              isVoiceRecording 
                ? 'bg-gradient-to-r from-red-500 to-pink-600 animate-pulse' 
                : 'bg-gradient-to-r from-purple-500 to-pink-600'
            }`}>
              <Mic className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-gray-900">
                {isVoiceRecording ? 'Listening...' : 'Voice Input'}
              </h3>
              <p className="text-xs text-gray-600">
                {isVoiceRecording ? 'Speak now' : 'Say your expense'}
              </p>
            </div>
          </div>
        </button>

        <label className="card cursor-pointer text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleReceiptUpload}
            className="hidden"
          />
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white shadow-md">
              <Receipt className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-gray-900">Upload Receipt</h3>
              <p className="text-xs text-gray-600">Auto-extract details</p>
            </div>
          </div>
        </label>

        <button
          type="button"
          onClick={() => toast.success('Camera feature coming soon! 📸')}
          className="card text-left hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Camera className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-gray-900">Take Photo</h3>
              <p className="text-xs text-gray-600">Capture receipt</p>
            </div>
          </div>
        </button>
      </div>

      {/* Main Form - Your existing form code stays exactly the same */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* All your existing form fields remain unchanged */}
        <div className="card">
          {/* Transaction Type */}
          <div className="mb-6">
            <label className="form-label">Transaction Type</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <label className={`
                flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200
                ${watchedType === 'expense' 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}>
                <input
                  {...register('type')}
                  type="radio"
                  value="expense"
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 flex items-center justify-center text-white mr-3">
                    −
                  </div>
                  <div>
                    <div className="font-medium">Expense</div>
                    <div className="text-xs text-gray-600">Money going out</div>
                  </div>
                </div>
              </label>

              <label className={`
                flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200
                ${watchedType === 'income' 
                  ? 'border-green-500 bg-green-50 text-green-700' 
                  : 'border-gray-300 hover:border-gray-400'
                }
              `}>
                <input
                  {...register('type')}
                  type="radio"
                  value="income"
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white mr-3">
                    +
                  </div>
                  <div>
                    <div className="font-medium">Income</div>
                    <div className="text-xs text-gray-600">Money coming in</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Amount & Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="amount" className="form-label flex items-center">
                <Calculator className="h-4 w-4 mr-1" />
                Amount *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  {...register('amount', {
                    required: 'Amount is required',
                    min: { value: 0.01, message: 'Amount must be greater than 0' },
                  })}
                  type="number"
                  step="0.01"
                  id="amount"
                  className={`input pl-8 text-lg font-semibold ${errors.amount ? 'input-error' : ''}`}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
              {errors.amount && (
                <p className="form-error">{errors.amount.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Date *
              </label>
              <input
                {...register('date', { required: 'Date is required' })}
                type="date"
                id="date"
                className={`input ${errors.date ? 'input-error' : ''}`}
                max={formatDate(new Date())}
                disabled={isLoading}
              />
              {errors.date && (
                <p className="form-error">{errors.date.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group mb-6">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <input
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 3, message: 'Description must be at least 3 characters' },
              })}
              type="text"
              id="description"
              className={`input ${errors.description ? 'input-error' : ''}`}
              placeholder="What did you spend money on?"
              disabled={isLoading}
            />
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
          </div>

          {/* Category & Payment Method Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label htmlFor="category" className="form-label flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Category *
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                id="category"
                className={`input ${errors.category ? 'input-error' : ''}`}
                disabled={isLoading}
              >
                {TRANSACTION_CATEGORIES.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="form-error">{errors.category.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="paymentMethod" className="form-label flex items-center">
                <CreditCard className="h-4 w-4 mr-1" />
                Payment Method
              </label>
              <select
                {...register('paymentMethod')}
                id="paymentMethod"
                className="input"
                disabled={isLoading}
              >
                {PAYMENT_METHODS.map(method => (
                  <option key={method} value={method}>
                    {method.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tax Deductible Checkbox */}
          <div className="form-group mb-6">
            <div className="flex items-center">
              <input
                {...register('isTaxDeductible')}
                type="checkbox"
                id="isTaxDeductible"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="isTaxDeductible" className="ml-2 flex items-center text-sm text-gray-700">
                <span>This is a tax-deductible business expense</span>
                {watch('isTaxDeductible') && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Tax Deductible
                  </span>
                )}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Check this if you can claim this expense as a business deduction
            </p>
          </div>

          {/* Notes */}
          <div className="form-group mb-6">
            <label htmlFor="notes" className="form-label">
              Notes (Optional)
            </label>
            <textarea
              {...register('notes')}
              id="notes"
              rows={3}
              className="input"
              placeholder="Add any additional details..."
              disabled={isLoading}
            />
          </div>

          {/* Tags */}
          <div className="form-group mb-6">
            <label htmlFor="tags" className="form-label">
              Tags (Optional)
            </label>
            <input
              {...register('tags')}
              type="text"
              id="tags"
              className="input"
              placeholder="client-lunch, project-alpha, marketing (comma separated)"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Add tags to organize and filter your expenses
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            disabled={isLoading}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex-1"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner mr-2"></div>
                Adding Transaction...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Save className="h-5 w-5 mr-2" />
                Add Transaction
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
