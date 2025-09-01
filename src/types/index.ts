// ============================================================================
// BILLION-DOLLAR TYPE SYSTEM - COMPLETE FINANCIAL PLATFORM TYPES
// ============================================================================

/**
 * Core User Interface - Supports both Consumer and Business accounts
 * This is the foundation of our user system that scales to millions
 */
export interface User {
  id: string;                    // Unique identifier for database indexing
  name: string;                  // Full user name for personalization
  email: string;                 // Primary authentication email
  avatar?: string;               // Profile image URL (optional)
  accountType: 'consumer' | 'business';  // Critical: determines entire UX flow
  plan: 'free' | 'pro' | 'premium' | 'enterprise';  // Monetization tier
  joinedAt: string;              // ISO timestamp for analytics
  lastLoginAt?: string;          // User engagement tracking
  
  // Consumer-specific fields (personal finance)
  monthlyIncome?: number;        // For budget recommendations and insights
  creditScore?: number;          // For loan and credit recommendations
  financialGoals?: FinancialGoal[];  // Personal savings and investment goals
  riskProfile?: 'conservative' | 'moderate' | 'aggressive';  // Investment recommendations
  
  // Business-specific fields (enterprise finance)
  companyName?: string;          // Company branding throughout app
  companySize?: number;          // For feature recommendations and pricing
  industry?: string;             // For compliance and industry-specific features
  role?: 'admin' | 'manager' | 'employee' | 'accountant';  // Permission levels
  department?: string;           // Expense categorization and reporting
  
  // Premium features
  subscriptionId?: string;       // Stripe subscription tracking
  trialEndsAt?: string;          // Trial period management
  billingEmail?: string;         // Separate billing contact
}

/**
 * Transaction Interface - Core of financial tracking
 * Handles both personal and business transactions with AI enhancement
 */
export interface Transaction {
  id: string;                    // Unique transaction identifier
  userId: string;                // Links to User.id for data isolation
  description: string;           // Human-readable transaction description
  amount: number;                // Always stored as positive number
  category: string;              // Primary categorization for analytics
  subcategory?: string;          // Detailed categorization
  date: string;                  // ISO date string for easy sorting
  isExpense: boolean;            // true = expense, false = income
  merchant: string;              // Where the transaction occurred
  currency: string;              // ISO currency code (USD, EUR, etc.)
  
  // Enhanced metadata
  paymentMethod?: 'credit_card' | 'debit_card' | 'cash' | 'bank_transfer' | 'digital_wallet';
  location?: {                   // Geographic data for insights
    lat: number;
    lng: number;
    address?: string;
  };
  receiptUrl?: string;           // S3 URL for receipt image
  notes?: string;                // User-added notes
  tags: string[];                // Flexible tagging system
  
  // Recurring transaction support
  isRecurring: boolean;
  recurringInfo?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    nextDate: string;
    endDate?: string;
    parentTransactionId?: string;  // Links to original recurring setup
  };
  
  // Business-specific fields
  projectId?: string;            // Project tracking for businesses
  departmentId?: string;         // Department allocation
  employeeId?: string;           // Who made the transaction
  isTaxDeductible?: boolean;     // Tax optimization
  approvalStatus?: 'pending' | 'approved' | 'rejected';  // Workflow status
  approvedBy?: string;           // User ID who approved
  approvedAt?: string;           // Approval timestamp
  
  // AI and ML fields
  aiCategory?: string;           // AI-suggested category
  aiConfidence?: number;         // Confidence score (0-1)
  fraudScore?: number;           // Fraud detection score (0-1)
  similarTransactions?: string[]; // IDs of similar transactions for learning
  
  // System metadata
  createdAt: string;             // Creation timestamp
  updatedAt: string;             // Last modification
  syncedAt?: string;             // Last bank sync timestamp
  syncSource: 'manual' | 'bank' | 'receipt_ocr' | 'voice' | 'api';  // Data source
  version: number;               // For optimistic concurrency control
}

/**
 * Financial Goal Interface - Personal wealth building
 * Supports various goal types with progress tracking and automation
 */
export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;                  // User-friendly goal name
  description?: string;          // Detailed goal description
  targetAmount: number;          // Goal amount in user's currency
  currentAmount: number;         // Current progress amount
  targetDate: string;            // ISO date when goal should be achieved
  category: 'emergency' | 'savings' | 'vacation' | 'house' | 'car' | 'education' | 'retirement' | 'debt_payoff' | 'custom';
  priority: 'low' | 'medium' | 'high';  // For AI prioritization
  
  // Automation features
  autoContribute?: {
    enabled: boolean;
    amount: number;              // Auto-contribution amount
    frequency: 'daily' | 'weekly' | 'monthly';
    sourceAccountId?: string;    // Which account to pull from
  };
  
  // Progress tracking
  milestones?: {
    percentage: number;          // 25%, 50%, 75%, etc.
    reached: boolean;
    reachedAt?: string;
    celebrationSent?: boolean;   // Track if we sent congratulations
  }[];
  
  // Analytics
  projectedCompletionDate?: string;  // AI-calculated completion estimate
  averageMonthlyProgress?: number;   // Historical progress rate
  
  createdAt: string;
  updatedAt: string;
  isActive: boolean;             // Can be paused
  isArchived: boolean;           // Completed or cancelled goals
}

/**
 * Budget Interface - Spending control and insights
 * Supports both category-based and project-based budgeting
 */
export interface Budget {
  id: string;
  userId: string;               // Personal budgets
  companyId?: string;           // Business budgets
  name: string;                 // Budget name for identification
  description?: string;         // Budget purpose and details
  
  // Budget configuration
  category: string;             // What this budget covers
  subcategories?: string[];     // Specific subcategories included
  monthlyLimit: number;         // Maximum monthly spend
  yearlyLimit?: number;         // Annual budget cap
  
  // Current status
  spent: number;                // Amount spent this period
  remaining: number;            // Calculated: limit - spent
  percentUsed: number;          // Calculated: (spent / limit) * 100
  
  // Time period
  period: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  periodStart: string;          // ISO date
  periodEnd: string;            // ISO date
  
  // Alert system
  alertThresholds: {
    warning: number;            // Percentage (e.g., 75)
    critical: number;           // Percentage (e.g., 90)
    warningTriggered?: boolean; // Track if alert was sent
    criticalTriggered?: boolean;
  };
  
  // Advanced features
  rollover: boolean;            // Unused budget carries to next period
  autoAdjust: boolean;          // AI adjusts based on spending patterns
  linkedGoalId?: string;        // Connect budget to financial goal
  
  // Business features
  departmentIds?: string[];     // Which departments this budget covers
  approvalRequired?: boolean;   // Require approval for spending
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Investment Interface - Portfolio tracking and analysis
 * Supports stocks, crypto, ETFs, mutual funds, real estate
 */
export interface Investment {
  id: string;
  userId: string;
  portfolioId?: string;         // Group investments into portfolios
  
  // Investment details
  symbol: string;               // Stock symbol (AAPL, BTC, etc.)
  name: string;                 // Full name of investment
  type: 'stock' | 'crypto' | 'etf' | 'mutual_fund' | 'bond' | 'real_estate' | 'commodity';
  
  // Quantity and pricing
  shares: number;               // Number of shares/units owned
  averageCost: number;          // Average cost basis per share
  currentPrice: number;         // Latest market price
  totalCost: number;            // Total amount invested
  totalValue: number;           // Current market value
  
  // Performance metrics
  unrealizedGain: number;       // Current gain/loss (not sold)
  unrealizedGainPercent: number; // Percentage gain/loss
  realizedGain?: number;        // Gains from sales (for tax purposes)
  dividendsReceived?: number;   // Total dividends collected
  
  // Acquisition info
  purchaseDate: string;         // When first purchased
  purchasePrice: number;        // Original purchase price
  brokerage: string;            // Which platform/broker
  account: string;              // Account identifier
  
  // AI insights
  aiRecommendation?: 'buy' | 'sell' | 'hold';
  aiConfidence?: number;
  riskScore?: number;           // AI-calculated risk (0-1)
  
  // Metadata
  lastUpdated: string;          // Last price update
  createdAt: string;
  notes?: string;               // User notes about investment
  isWatchlist?: boolean;        // Track without owning
}

// Business-specific types for enterprise features
export interface BusinessTeamMember {
  id: string;
  companyId: string;
  userId: string;               // Links to User table
  invitedBy: string;            // User ID who sent invitation
  
  // Role and permissions
  role: 'admin' | 'manager' | 'employee' | 'accountant' | 'viewer';
  permissions: Permission[];    // Granular permission system
  department: string;
  jobTitle?: string;
  
  // Financial limits
  monthlyBudget?: number;       // Individual spending limit
  spentThisMonth: number;       // Current month spending
  approvalLimit: number;        // Can approve up to this amount
  
  // Status and lifecycle
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  invitedAt: string;
  joinedAt?: string;
  lastActiveAt?: string;
  
  // Notification preferences
  emailNotifications: boolean;
  slackUserId?: string;         // For Slack integration
  
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  resource: string;             // 'transactions', 'reports', 'team', etc.
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve')[];
  conditions?: {                // Advanced permission conditions
    departmentOnly?: boolean;   // Can only see own department
    amountLimit?: number;       // Dollar amount limits
    timeRange?: string;         // Access to historical data
  };
}

/**
 * AI Insight Interface - Machine learning recommendations
 * Powers the intelligent features that set us apart
 */
export interface AIInsight {
  id: string;
  userId: string;
  companyId?: string;           // For business insights
  
  // Insight classification
  type: 'saving_opportunity' | 'budget_alert' | 'goal_progress' | 'fraud_alert' | 
        'investment_suggestion' | 'spending_pattern' | 'cash_flow_prediction' | 
        'tax_optimization' | 'subscription_waste' | 'bill_negotiation';
        
  category: 'financial_health' | 'spending' | 'saving' | 'investing' | 'security' | 'taxes';
  
  // Content
  title: string;                // Attention-grabbing headline
  description: string;          // Detailed explanation
  summary?: string;             // TL;DR version
  
  // Importance and urgency
  priority: 'low' | 'medium' | 'high' | 'critical';
  urgency: 'low' | 'medium' | 'high';  // How quickly user should act
  
  // Financial impact
  potentialSavings?: number;    // How much user could save
  potentialEarnings?: number;   // How much user could earn
  riskAmount?: number;          // Amount at risk if ignored
  
  // ML metadata
  confidence: number;           // Model confidence (0-1)
  modelVersion: string;         // Which AI model generated this
  dataPoints: string[];         // What data was used for this insight
  
  // User interaction
  actionable: boolean;          // Can user take direct action?
  actionText?: string;          // Button text for action
  actionUrl?: string;           // Deep link to relevant page
  dismissed: boolean;           // User dismissed this insight
  dismissedAt?: string;
  
  // A/B testing
  variant?: string;             // For testing different presentations
  
  // Lifecycle
  createdAt: string;
  expiresAt?: string;           // Some insights expire
  isRead: boolean;
  readAt?: string;
}

/**
 * Notification Interface - Multi-channel communication system
 * Supports email, SMS, push, in-app, Slack, etc.
 */
export interface Notification {
  id: string;
  userId: string;
  
  // Content
  type: 'info' | 'success' | 'warning' | 'error' | 'update';
  title: string;
  message: string;
  richContent?: {              // For complex notifications
    html?: string;
    imageUrl?: string;
    buttons?: NotificationButton[];
  };
  
  // Delivery channels
  channels: ('in_app' | 'email' | 'sms' | 'push' | 'slack')[];
  
  // Interaction tracking
  read: boolean;
  readAt?: string;
  clicked: boolean;
  clickedAt?: string;
  actionTaken?: string;         // Which action user took
  
  // Scheduling
  scheduledFor?: string;        // ISO timestamp for scheduled delivery
  deliveredAt?: string;
  
  // Personalization
  priority: 'low' | 'medium' | 'high';
  category: string;             // For notification preferences
  
  createdAt: string;
  expiresAt?: string;
}

export interface NotificationButton {
  text: string;
  url?: string;
  action?: string;              // Custom action identifier
  style: 'primary' | 'secondary' | 'danger';
}

// API Response wrapper for consistent error handling
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;               // Error code for programmatic handling
    message: string;            // Human-readable error message
    details?: any;              // Additional error context
    field?: string;             // Which field caused validation error
  };
  meta?: {
    total?: number;             // Total count for paginated results
    page?: number;              // Current page number
    limit?: number;             // Items per page
    hasMore?: boolean;          // Are there more pages?
    processingTime?: number;    // API response time for monitoring
  };
  timestamp: string;            // When response was generated
  version: string;              // API version for compatibility
}

// Paginated response for list endpoints
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

/**
 * Feature Flags Interface - Control feature rollout
 * Enables safe deployment and A/B testing
 */
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

// Export all types for easy importing
export type {
  User,
  Transaction,
  FinancialGoal,
  Budget,
  Investment,
  BusinessTeamMember,
  Permission,
  AIInsight,
  Notification,
  NotificationButton,
  ApiResponse,
  PaginatedResponse,
  FeatureFlags
};
