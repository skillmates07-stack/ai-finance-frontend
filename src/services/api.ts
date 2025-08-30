import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { 
  ApiResponse, 
  User, 
  Transaction, 
  TransactionsResponse, 
  AnalyticsData,
  LoginFormData,
  RegisterFormData,
  TransactionFormData,
  TransactionFilters 
} from '@/types';

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000');

// Create axios instance with default configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth token to all requests
  client.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add request timestamp for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
          params: config.params,
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle common response scenarios
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log successful responses in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          data: response.data,
        });
      }
      
      return response;
    },
    (error) => {
      // Handle common error scenarios
      if (error.response) {
        const { status, data } = error.response;
        
        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
          console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status,
            data,
            error: error.message,
          });
        }
        
        // Handle authentication errors
        if (status === 401) {
          // Token expired or invalid
          removeAuthToken();
          
          // Redirect to login if not already on auth page
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login?expired=true';
          }
        }
        
        // Handle specific error types
        switch (status) {
          case 400:
            throw new Error(data?.details || data?.message || 'Invalid request');
          case 403:
            throw new Error('Access denied. You do not have permission to perform this action.');
          case 404:
            throw new Error('Resource not found');
          case 409:
            throw new Error(data?.message || 'Conflict occurred');
          case 422:
            throw new Error(data?.details || 'Validation failed');
          case 429:
            throw new Error('Too many requests. Please try again later.');
          case 500:
            throw new Error('Internal server error. Please try again later.');
          default:
            throw new Error(data?.message || `Request failed with status ${status}`);
        }
      } else if (error.request) {
        // Request was made but no response received
        throw new Error('Network error. Please check your internet connection.');
      } else {
        // Something else happened
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  );

  return client;
};

// Create the main API client
const apiClient = createApiClient();

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

const TOKEN_KEY = 'auth_token';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  // Store in both cookie and localStorage for reliability
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  
  Cookies.remove(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ============================================================================
// AUTHENTICATION SERVICES
// ============================================================================

export const authService = {
  // Register new user
  register: async (userData: RegisterFormData): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/register', 
      userData
    );
    
    if (response.data.success && response.data.data) {
      const { user, token } = response.data.data;
      setAuthToken(token);
      return { user, token };
    }
    
    throw new Error(response.data.error || 'Registration failed');
  },

  // Login user
  login: async (credentials: LoginFormData): Promise<{ user: User; token: string }> => {
    const response = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login', 
      credentials
    );
    
    if (response.data.success && response.data.data) {
      const { user, token } = response.data.data;
      setAuthToken(token);
      return { user, token };
    }
    
    throw new Error(response.data.error || 'Login failed');
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/auth/profile');
    
    if (response.data.success && response.data.data) {
      return response.data.data.user;
    }
    
    throw new Error(response.data.error || 'Failed to fetch profile');
  },

  // Update user profile
  updateProfile: async (profileData: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(
      '/auth/profile', 
      profileData
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data.user;
    }
    
    throw new Error(response.data.error || 'Failed to update profile');
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const response = await apiClient.post<ApiResponse>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to change password');
    }
  },

  // Verify token
  verifyToken: async (): Promise<User> => {
    const response = await apiClient.post<ApiResponse<{ user: User }>>('/auth/verify-token');
    
    if (response.data.success && response.data.data) {
      return response.data.data.user;
    }
    
    throw new Error('Token verification failed');
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<ApiResponse>('/auth/logout');
    } catch (error) {
      // Logout on client side even if server request fails
      console.warn('Server logout failed, performing client-side logout');
    } finally {
      removeAuthToken();
    }
  },
};

// ============================================================================
// TRANSACTION SERVICES
// ============================================================================

export const transactionService = {
  // Create new transaction
  create: async (transactionData: TransactionFormData): Promise<Transaction> => {
    const response = await apiClient.post<ApiResponse<{ transaction: Transaction }>>(
      '/transactions',
      transactionData
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data.transaction;
    }
    
    throw new Error(response.data.error || 'Failed to create transaction');
  },

  // Get transactions with filtering and pagination
  getAll: async (filters: TransactionFilters = {}): Promise<TransactionsResponse> => {
    const response = await apiClient.get<ApiResponse<TransactionsResponse>>('/transactions', {
      params: filters,
    });
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch transactions');
  },

  // Get single transaction by ID
  getById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<ApiResponse<{ transaction: Transaction }>>(
      `/transactions/${id}`
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data.transaction;
    }
    
    throw new Error(response.data.error || 'Failed to fetch transaction');
  },

  // Update transaction
  update: async (id: string, transactionData: Partial<TransactionFormData>): Promise<Transaction> => {
    const response = await apiClient.put<ApiResponse<{ transaction: Transaction }>>(
      `/transactions/${id}`,
      transactionData
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data.transaction;
    }
    
    throw new Error(response.data.error || 'Failed to update transaction');
  },

  // Delete transaction
  delete: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse>(`/transactions/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to delete transaction');
    }
  },

  // Get analytics summary
  getAnalytics: async (startDate?: string, endDate?: string): Promise<AnalyticsData> => {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get<ApiResponse<AnalyticsData>>(
      '/transactions/analytics/summary',
      { params }
    );
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    
    throw new Error(response.data.error || 'Failed to fetch analytics');
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Format currency amounts
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format dates
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

// Get category color
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    'Food & Dining': '#ef4444',
    'Transportation': '#3b82f6',
    'Shopping': '#8b5cf6',
    'Entertainment': '#f59e0b',
    'Bills & Utilities': '#6b7280',
    'Healthcare': '#10b981',
    'Education': '#06b6d4',
    'Travel': '#ec4899',
    'Business Expenses': '#84cc16',
    'Income': '#22c55e',
    'Investment': '#14b8a6',
    'Transfer': '#64748b',
    'Other': '#9ca3af',
  };
  
  return colors[category] || '#9ca3af';
};

// Export the main API client for custom requests
export { apiClient };

// Export all services as default
export default {
  auth: authService,
  transactions: transactionService,
  formatCurrency,
  formatDate,
  getCategoryColor,
  isAuthenticated,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
};
