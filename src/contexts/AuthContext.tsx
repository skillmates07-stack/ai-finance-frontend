'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'enterprise';
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const savedUser = localStorage.getItem('aifinance_user');
        const authToken = localStorage.getItem('aifinance_token');
        
        if (savedUser && authToken) {
          const userData = JSON.parse(savedUser);
          // Validate user data structure
          if (userData.id && userData.email && userData.name) {
            setUser(userData);
          } else {
            // Invalid user data, clear storage
            localStorage.removeItem('aifinance_user');
            localStorage.removeItem('aifinance_token');
          }
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem('aifinance_user');
        localStorage.removeItem('aifinance_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo: Accept any email/password combination
      if (email && password && email.includes('@') && password.length >= 6) {
        const userData: User = {
          id: `user_${Date.now()}`,
          name: email.split('@')[0].replace(/[._]/g, ' ').split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '),
          email: email.toLowerCase(),
          plan: 'free',
          joinedAt: new Date().toISOString(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff&size=100`
        };
        
        // Generate mock auth token
        const authToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store user data and token
        setUser(userData);
        localStorage.setItem('aifinance_user', JSON.stringify(userData));
        localStorage.setItem('aifinance_token', authToken);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo: Accept any valid inputs
      if (name && email && password && email.includes('@') && password.length >= 6) {
        const userData: User = {
          id: `user_${Date.now()}`,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          plan: 'free',
          joinedAt: new Date().toISOString(),
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=100`
        };
        
        // Generate mock auth token
        const authToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Store user data and token
        setUser(userData);
        localStorage.setItem('aifinance_user', JSON.stringify(userData));
        localStorage.setItem('aifinance_token', authToken);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('aifinance_user');
      localStorage.removeItem('aifinance_token');
      sessionStorage.clear(); // Clear any session data
      
      toast.success('Logged out successfully! See you soon! 👋', {
        duration: 3000,
      });
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if there's an error
      setUser(null);
      router.push('/');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated,
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
    throw new Error('useAuth must be used within an AuthProvider. Make sure to wrap your app with <AuthProvider>.');
  }
  return context;
}

// Export types for use in other components
export type { User };
