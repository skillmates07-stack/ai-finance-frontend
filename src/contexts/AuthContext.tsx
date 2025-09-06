'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import type { User, FeatureFlags } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  switchAccountType: (type: 'consumer' | 'business') => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  featureFlags: FeatureFlags;
  hasFeature: (feature: keyof FeatureFlags) => boolean;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  accountType: 'consumer' | 'business';
  companyName?: string;
  monthlyIncome?: number;
  acceptTerms: boolean;
  marketingOptIn?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getFeatureFlags = (user: User | null): FeatureFlags => {
  if (!user) {
    return {
      INVESTMENT_TRACKING: false,
      AI_BUDGET_OPTIMIZER: false,
      VOICE_TRANSACTIONS: false,
      RECEIPT_OCR: false,
      BANK_SYNC: false,
      CREDIT_SCORE_MONITORING: false,
      GOAL_AUTOMATION: false,
      CASH_FLOW_PREDICTION: false,
      TEAM_MANAGEMENT: false,
      APPROVAL_WORKFLOWS: false,
      ADVANCED_REPORTING: false,
      MULTI_CURRENCY: false,
      QUICKBOOKS_SYNC: false,
      SLACK_INTEGRATION: false,
      CUSTOM_ROLES: false,
      AUDIT_LOGS: false,
      FINANCIAL_ADVISOR_CHAT: false,
      CUSTOM_INTEGRATIONS: false,
      WHITE_LABEL: false,
      PRIORITY_SUPPORT: false,
      UNLIMITED_HISTORY: false,
      ADVANCED_ANALYTICS: false,
      CRYPTO_TRACKING: false,
      AI_TAX_OPTIMIZER: false,
      REAL_ESTATE_TRACKING: false,
      INTERNATIONAL_TRANSFERS: false,
    };
  }

  const baseFlags = {
    INVESTMENT_TRACKING: false,
    AI_BUDGET_OPTIMIZER: false,
    VOICE_TRANSACTIONS: false,
    RECEIPT_OCR: false,
    BANK_SYNC: false,
    CREDIT_SCORE_MONITORING: false,
    GOAL_AUTOMATION: false,
    CASH_FLOW_PREDICTION: false,
    TEAM_MANAGEMENT: false,
    APPROVAL_WORKFLOWS: false,
    ADVANCED_REPORTING: false,
    MULTI_CURRENCY: false,
    QUICKBOOKS_SYNC: false,
    SLACK_INTEGRATION: false,
    CUSTOM_ROLES: false,
    AUDIT_LOGS: false,
    FINANCIAL_ADVISOR_CHAT: false,
    CUSTOM_INTEGRATIONS: false,
    WHITE_LABEL: false,
    PRIORITY_SUPPORT: false,
    UNLIMITED_HISTORY: false,
    ADVANCED_ANALYTICS: false,
    CRYPTO_TRACKING: false,
    AI_TAX_OPTIMIZER: false,
    REAL_ESTATE_TRACKING: false,
    INTERNATIONAL_TRANSFERS: false,
  };

  // Consumer feature unlocking
  if (user.accountType === 'consumer') {
    if (user.plan === 'pro' || user.plan === 'premium') {
      baseFlags.INVESTMENT_TRACKING = true;
      baseFlags.AI_BUDGET_OPTIMIZER = true;
      baseFlags.VOICE_TRANSACTIONS = true;
      baseFlags.RECEIPT_OCR = true;
      baseFlags.BANK_SYNC = true;
      baseFlags.GOAL_AUTOMATION = true;
    }
    
    if (user.plan === 'premium') {
      baseFlags.CREDIT_SCORE_MONITORING = true;
      baseFlags.CASH_FLOW_PREDICTION = true;
      baseFlags.FINANCIAL_ADVISOR_CHAT = true;
      baseFlags.PRIORITY_SUPPORT = true;
      baseFlags.UNLIMITED_HISTORY = true;
      baseFlags.CRYPTO_TRACKING = true;
      baseFlags.AI_TAX_OPTIMIZER = true;
      baseFlags.REAL_ESTATE_TRACKING = true;
    }
  }
  
  // Business feature unlocking
  if (user.accountType === 'business') {
    if (user.plan === 'pro' || user.plan === 'enterprise') {
      baseFlags.TEAM_MANAGEMENT = true;
      baseFlags.APPROVAL_WORKFLOWS = true;
      baseFlags.ADVANCED_REPORTING = true;
      baseFlags.MULTI_CURRENCY = true;
      baseFlags.RECEIPT_OCR = true;
      baseFlags.BANK_SYNC = true;
      baseFlags.AUDIT_LOGS = true;
    }
    
    if (user.plan === 'enterprise') {
      baseFlags.QUICKBOOKS_SYNC = true;
      baseFlags.SLACK_INTEGRATION = true;
      baseFlags.CUSTOM_ROLES = true;
      baseFlags.CUSTOM_INTEGRATIONS = true;
      baseFlags.WHITE_LABEL = true;
      baseFlags.PRIORITY_SUPPORT = true;
      baseFlags.UNLIMITED_HISTORY = true;
      baseFlags.ADVANCED_ANALYTICS = true;
      baseFlags.INTERNATIONAL_TRANSFERS = true;
    }
  }

  return baseFlags;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;
  const featureFlags = getFeatureFlags(user);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const savedUser = localStorage.getItem('aifinance_user');
      const authToken = localStorage.getItem('aifinance_token');
      const tokenExpiry = localStorage.getItem('aifinance_token_expiry');
      
      if (savedUser && authToken && tokenExpiry) {
        const expiryTime = parseInt(tokenExpiry);
        const currentTime = Date.now();
        
        if (currentTime > expiryTime) {
          localStorage.removeItem('aifinance_user');
          localStorage.removeItem('aifinance_token');
          localStorage.removeItem('aifinance_token_expiry');
          clearAuthCookies();
          return;
        }
        
        const userData = JSON.parse(savedUser);
        if (userData.id && userData.email && userData.accountType) {
          setUser(userData);
          setAuthCookies(userData.accountType, authToken);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        toast.error('Please enter both email and password');
        return false;
      }
      
      if (!email.includes('@') || password.length < 6) {
        toast.error('Please enter a valid email and password (min 6 characters)');
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const accountType = detectAccountType(email);

      const userData: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: generateDisplayName(email),
        email: email.toLowerCase().trim(),
        accountType,
        plan: accountType === 'business' ? 'pro' : 'free',
        joinedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        avatar: generateAvatarUrl(email),
        
        ...(accountType === 'consumer' && {
          monthlyIncome: 5000,
          creditScore: 750,
          financialGoals: [],
          riskProfile: 'moderate' as const
        }),
        
        ...(accountType === 'business' && {
          companyName: generateCompanyName(email),
          companySize: 25,
          industry: 'Technology',
          role: 'admin' as const,
          department: 'Executive'
        })
      };
      
      const authToken = generateSecureToken();
      const tokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000);
      
      setUser(userData);
      localStorage.setItem('aifinance_user', JSON.stringify(userData));
      localStorage.setItem('aifinance_token', authToken);
      localStorage.setItem('aifinance_token_expiry', tokenExpiry.toString());
      
      setAuthCookies(userData.accountType, authToken);
      
      toast.success(`Welcome ${userData.accountType === 'business' ? 'back to your business dashboard' : 'to AI Finance'}! 🎉`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const validation = validateRegistrationData(userData);
      if (!validation.isValid) {
        toast.error(validation.error || 'Please check your information');
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        accountType: userData.accountType,
        plan: userData.accountType === 'business' ? 'pro' : 'free',
        joinedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        avatar: generateAvatarUrl(userData.email),
        
        ...(userData.accountType === 'consumer' && {
          monthlyIncome: userData.monthlyIncome || 0,
          creditScore: 720,
          financialGoals: [],
          riskProfile: 'moderate' as const
        }),
        
        ...(userData.accountType === 'business' && {
          companyName: userData.companyName || `${userData.name} Company`,
          companySize: 10,
          industry: 'Technology',
          role: 'admin' as const,
          department: 'Executive'
        })
      };
      
      const authToken = generateSecureToken();
      const tokenExpiry = Date.now() + (7 * 24 * 60 * 60 * 1000);
      
      setUser(newUser);
      localStorage.setItem('aifinance_user', JSON.stringify(newUser));
      localStorage.setItem('aifinance_token', authToken);
      localStorage.setItem('aifinance_token_expiry', tokenExpiry.toString());
      
      setAuthCookies(newUser.accountType, authToken);
      
      toast.success('Account created successfully! Welcome to AI Finance! 🚀');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const switchAccountType = (type: 'consumer' | 'business') => {
    if (!user) return;
    
    const updatedUser: User = {
      ...user,
      accountType: type,
      plan: type === 'business' ? 'pro' : user.plan,
      
      ...(type === 'consumer' && {
        monthlyIncome: user.monthlyIncome || 5000,
        riskProfile: user.riskProfile || 'moderate',
        financialGoals: user.financialGoals || [],
        creditScore: user.creditScore || 750,
      }),
      ...(type === 'business' && {
        companyName: user.companyName || `${user.name} Company`,
        companySize: user.companySize || 10,
        industry: user.industry || 'Technology',
        role: user.role || 'admin',
        department: user.department || 'Executive',
      })
    };
    
    setUser(updatedUser);
    localStorage.setItem('aifinance_user', JSON.stringify(updatedUser));
    
    const authToken = localStorage.getItem('aifinance_token');
    if (authToken) {
      setAuthCookies(type, authToken);
    }
    
    toast.success(`Switched to ${type === 'consumer' ? 'Personal' : 'Business'} account! 🔄`);
    
    const redirectPath = type === 'consumer' ? '/dashboard' : '/business/admin';
    router.push(redirectPath);
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('aifinance_user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      // TODO: Fetch fresh user data from backend
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      clearAuthData();
      
      toast.success('Logged out successfully! See you soon! 👋');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      router.push('/');
    }
  };

  const hasFeature = (feature: keyof FeatureFlags): boolean => {
    return featureFlags[feature] || false;
  };

  // Helper functions
  const detectAccountType = (email: string): 'consumer' | 'business' => {
    const businessIndicators = [
      'business', 'company', 'corp', 'llc', 'inc', 'ltd',
      'admin', 'ceo', 'cfo', 'manager', 'accounting',
      'finance', 'payroll', 'hr'
    ];
    
    const emailLower = email.toLowerCase();
    return businessIndicators.some(indicator => emailLower.includes(indicator)) 
      ? 'business' 
      : 'consumer';
  };

  const generateDisplayName = (email: string): string => {
    return email.split('@')[0]
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const generateCompanyName = (email: string): string => {
    const name = email.split('@')[0];
    return `${name.charAt(0).toUpperCase() + name.slice(1)} Corp`;
  };

  const generateAvatarUrl = (email: string): string => {
    const name = encodeURIComponent(email.split('@')[0]);
    return `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff&size=128&bold=true`;
  };

  const generateSecureToken = (): string => {
    return `aifinance_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  };

  const setAuthCookies = (accountType: string, token: string) => {
    const maxAge = 7 * 24 * 60 * 60;
    document.cookie = `user_type=${accountType}; path=/; max-age=${maxAge}; secure; samesite=strict`;
    document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; secure; samesite=strict`;
  };

  const clearAuthCookies = () => {
    document.cookie = 'user_type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  };

  const clearAuthData = () => {
    localStorage.removeItem('aifinance_user');
    localStorage.removeItem('aifinance_token');
    localStorage.removeItem('aifinance_token_expiry');
    sessionStorage.clear();
    clearAuthCookies();
  };

  const validateRegistrationData = (data: RegisterData): { isValid: boolean; error?: string } => {
    if (!data.name?.trim()) {
      return { isValid: false, error: 'Name is required' };
    }
    
    if (!data.email?.includes('@')) {
      return { isValid: false, error: 'Valid email is required' };
    }
    
    if (!data.password || data.password.length < 6) {
      return { isValid: false, error: 'Password must be at least 6 characters' };
    }
    
    if (!data.acceptTerms) {
      return { isValid: false, error: 'Please accept the Terms of Service' };
    }
    
    if (data.accountType === 'business' && !data.companyName?.trim()) {
      return { isValid: false, error: 'Company name is required for business accounts' };
    }
    
    return { isValid: true };
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    switchAccountType,
    refreshUser,
    isLoading,
    isAuthenticated,
    featureFlags,
    hasFeature,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
