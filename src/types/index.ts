// ============================================================================
// BILLION-DOLLAR TYPE SYSTEM - ENTERPRISE GRADE
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  accountType: 'consumer' | 'business';
  plan: 'free' | 'pro' | 'premium' | 'enterprise';
  joinedAt: string;
  lastLoginAt?: string;
  
  // Consumer specific
  monthlyIncome?: number;
  creditScore?: number;
  financialGoals?: FinancialGoal[];
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';
  
  // Business specific
  companyName?: string;
  companySize?: number;
  industry?: string;
  role?: 'admin' | 'manager' | 'employee' | 'accountant';
  department?: string;
  
  // Subscription
  subscriptionId?: string;
  trialEndsAt?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  subcategory?: string;
  date: string;
  isExpense: boolean;
  merchant: string;
  currency: string;
  paymentMethod?: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'digital_wallet';
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  receiptUrl?: string;
  notes?: string;
  tags: string[];
  
  // Recurring transaction support
  isRecurring: boolean;
  recurringInfo?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextDate: string;
    endDate?: string;
  };
  
  // Business specific
  projectId?: string;
  departmentId?: string;
  employeeId?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  
  // AI enhancement
  aiCategory?: string;
  aiConfidence?: number;
  fraudScore?: number;
  
  // System metadata
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
  syncSource: 'manual' | 'bank' | 'receipt_ocr' | 'voice' | 'api';
  version: number;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: 'emergency' | 'savings' | 'vacation' | 'house' | 'car' | 'education' | 'retirement' | 'debt_payoff' | 'custom';
  priority: 'low' | 'medium' | 'high';
  
  // Automation
  autoContribute?: {
    enabled: boolean;
    amount: number;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  
  // Progress tracking
  milestones?: {
    percentage: number;
    reached: boolean;
    reachedAt?: string;
  }[];
  
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isArchived: boolean;
}

export interface Budget {
  id: string;
  userId: string;
  companyId?: string;
  name: string;
  description?: string;
  category: string;
  subcategories?: string[];
  monthlyLimit: number;
  yearlyLimit?: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  
  period: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  periodStart: string;
  periodEnd: string;
  
  alertThresholds: {
    warning: number;
    critical: number;
    warningTriggered?: boolean;
    criticalTriggered?: boolean;
  };
  
  rollover: boolean;
  autoAdjust: boolean;
  linkedGoalId?: string;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  portfolioId?: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'etf' | 'mutual_fund' | 'bond' | 'real_estate' | 'commodity';
  shares: number;
  averageCost: number;
  currentPrice: number;
  totalCost: number;
  totalValue: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  realizedGain?: number;
  dividendsReceived?: number;
  purchaseDate: string;
  purchasePrice: number;
  brokerage: string;
  account: string;
  
  // AI insights
  aiRecommendation?: 'buy' | 'sell' | 'hold';
  aiConfidence?: number;
  riskScore?: number;
  
  lastUpdated: string;
  createdAt: string;
  notes?: string;
  isWatchlist?: boolean;
}

export interface BusinessTeamMember {
  id: string;
  companyId: string;
  userId: string;
  invitedBy: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'accountant' | 'viewer';
  permissions: Permission[];
  department: string;
  jobTitle?: string;
  monthlyBudget?: number;
  spentThisMonth: number;
  approvalLimit: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  invitedAt: string;
  joinedAt?: string;
  lastActiveAt?: string;
  emailNotifications: boolean;
  slackUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve')[];
  conditions?: {
    departmentOnly?: boolean;
    amountLimit?: number;
    timeRange?: string;
  };
}

export interface AIInsight {
  id: string;
  userId: string;
  companyId?: string;
  type: 'saving_opportunity' | 'budget_alert' | 'goal_progress' | 'fraud_alert' | 
        'investment_suggestion' | 'spending_pattern' | 'cash_flow_prediction' | 
        'tax_optimization' | 'subscription_waste' | 'bill_negotiation';
  category: 'financial_health' | 'spending' | 'saving' | 'investing' | 'security' | 'taxes';
  title: string;
  description: string;
  summary?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high';
  potentialSavings?: number;
  potentialEarnings?: number;
  riskAmount?: number;
  confidence: number;
  modelVersion: string;
  dataPoints: string[];
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
  dismissed: boolean;
  dismissedAt?: string;
  variant?: string;
  createdAt: string;
  expiresAt?: string;
  isRead: boolean;
  readAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'update';
  title: string;
  message: string;
  richContent?: {
    html?: string;
    imageUrl?: string;
    buttons?: NotificationButton[];
  };
  channels: ('in_app' | 'email' | 'sms' | 'push' | 'slack')[];
  read: boolean;
  readAt?: string;
  clicked: boolean;
  clickedAt?: string;
  actionTaken?: string;
  scheduledFor?: string;
  deliveredAt?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationButton {
  text: string;
  url?: string;
  action?: string;
  style: 'primary' | 'secondary' | 'danger';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
    field?: string;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
    processingTime?: number;
  };
  timestamp: string;
  version: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FeatureFlags {
  // Consumer features
  INVESTMENT_TRACKING: boolean;
  AI_BUDGET_OPTIMIZER: boolean;
  VOICE_TRANSACTIONS: boolean;
  RECEIPT_OCR: boolean;
  BANK_SYNC: boolean;
  CREDIT_SCORE_MONITORING: boolean;
  GOAL_AUTOMATION: boolean;
  CASH_FLOW_PREDICTION: boolean;
  
  // Business features
  TEAM_MANAGEMENT: boolean;
  APPROVAL_WORKFLOWS: boolean;
  ADVANCED_REPORTING: boolean;
  MULTI_CURRENCY: boolean;
  QUICKBOOKS_SYNC: boolean;
  SLACK_INTEGRATION: boolean;
  CUSTOM_ROLES: boolean;
  AUDIT_LOGS: boolean;
  
  // Premium features
  FINANCIAL_ADVISOR_CHAT: boolean;
  CUSTOM_INTEGRATIONS: boolean;
  WHITE_LABEL: boolean;
  PRIORITY_SUPPORT: boolean;
  UNLIMITED_HISTORY: boolean;
  ADVANCED_ANALYTICS: boolean;
  
  // Experimental features
  CRYPTO_TRACKING: boolean;
  AI_TAX_OPTIMIZER: boolean;
  REAL_ESTATE_TRACKING: boolean;
  INTERNATIONAL_TRANSFERS: boolean;
}
