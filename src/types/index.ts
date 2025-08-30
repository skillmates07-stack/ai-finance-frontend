// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  phoneNumber?: string;
  currency: 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'INR';
  timezone: string;
  preferences: UserPreferences;
  subscription: Subscription;
  connectedServices: ConnectedServices;
  isEmailVerified: boolean;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  fullName: string; // Virtual field
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    shareInsights: boolean;
  };
  automation: {
    emailProcessing: boolean;
    smsProcessing: boolean;
    autoCategories: boolean;
  };
}

export interface Subscription {
  plan: 'free' | 'pro' | 'business';
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate?: string;
}

export interface ConnectedServices {
  gmail: {
    connected: boolean;
    lastSync?: string;
  };
  banking: {
    connectedAccounts: string[];
    lastSync?: string;
  };
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export interface Transaction {
  _id: string;
  userId: string;
  amount: number;
  description: string;
  date: string;
  category: TransactionCategory;
  subcategory?: string;
  type: TransactionType;
  isTaxDeductible: boolean;
  taxCategory?: TaxCategory;
  location?: Location;
  paymentMethod: PaymentMethod;
  source: TransactionSource;
  aiProcessing: AIProcessing;
  attachments: Attachment[];
  merchant?: Merchant;
  project?: Project;
  status: TransactionStatus;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  monthYear: string; // Virtual field
  absoluteAmount: number; // Virtual field
}

export type TransactionCategory = 
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping' 
  | 'Entertainment'
  | 'Bills & Utilities'
  | 'Healthcare'
  | 'Education'
  | 'Travel'
  | 'Business Expenses'
  | 'Income'
  | 'Investment'
  | 'Transfer'
  | 'Other';

export type TransactionType = 'income' | 'expense' | 'transfer';

export type TaxCategory = 'business' | 'medical' | 'education' | 'charity' | 'other';

export type PaymentMethod = 
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'bank_transfer'
  | 'mobile_payment'
  | 'check'
  | 'other';

export type TransactionSource = 
  | 'manual'
  | 'email'
  | 'sms'
  | 'voice'
  | 'bank_sync'
  | 'api';

export type TransactionStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Location {
  name?: string;
  address?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface AIProcessing {
  confidence: number;
  originalCategory?: string;
  userCorrected: boolean;
  processingDate: string;
}

export interface Attachment {
  type: 'receipt' | 'invoice' | 'image' | 'document';
  url: string;
  filename?: string;
  size?: number;
  uploadedAt: string;
}

export interface Merchant {
  name?: string;
  category?: string;
  website?: string;
}

export interface Project {
  name?: string;
  code?: string;
  client?: string;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextDate?: string;
  endDate?: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: PaginationInfo;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface AnalyticsSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface CategoryBreakdown {
  _id: string;
  totalAmount: number;
  count: number;
}

export interface MonthlyTrend {
  _id: TransactionType;
  totalAmount: number;
  count: number;
  avgAmount: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrend[];
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface TransactionFormData {
  amount: number | string;
  description: string;
  date: string;
  category: TransactionCategory;
  subcategory?: string;
  type?: TransactionType;
  isTaxDeductible?: boolean;
  taxCategory?: TaxCategory;
  paymentMethod?: PaymentMethod;
  notes?: string;
  tags?: string[];
}

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  currency: User['currency'];
  timezone: string;
  preferences: UserPreferences;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: string;
  errorCode?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

// ============================================================================
// FILTER & SEARCH TYPES
// ============================================================================

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: TransactionCategory;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  sortBy?: 'date' | 'amount' | 'description' | 'category';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

// ============================================================================
// CHART DATA TYPES
// ============================================================================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  category?: string;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area';
  data: ChartDataPoint[] | TimeSeriesDataPoint[];
  options?: any;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ============================================================================
// THEME TYPES
// ============================================================================

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
    info: string;
    light: string;
    dark: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
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

export const PAYMENT_METHODS: PaymentMethod[] = [
  'cash',
  'credit_card',
  'debit_card',
  'bank_transfer',
  'mobile_payment',
  'check',
  'other'
];

export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
] as const;

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Manual transaction entry', 'Basic categorization', 'Simple reports']
  },
  {
    id: 'pro', 
    name: 'Pro',
    price: 19,
    features: ['AI categorization', 'Email processing', 'Advanced analytics', 'Tax optimization']
  },
  {
    id: 'business',
    name: 'Business', 
    price: 99,
    features: ['Everything in Pro', 'Multi-user access', 'API integration', 'White-label options']
  }
] as const;
