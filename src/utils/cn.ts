/**
 * BILLION-DOLLAR CLASS NAME UTILITY
 * 
 * This utility provides enterprise-grade class name management:
 * - Merges Tailwind CSS classes intelligently without conflicts
 * - Handles conditional classes with type safety
 * - Optimizes bundle size with tree shaking
 * - Supports complex class combinations for dynamic styling
 * - Professional error handling and validation
 * 
 * Used throughout the platform for:
 * - Dynamic component styling
 * - Conditional UI states
 * - Theme switching
 * - Responsive design classes
 * - Interactive element styling
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges class names intelligently
 * 
 * @param inputs - Array of class values (strings, objects, arrays, etc.)
 * @returns Merged class string with conflicts resolved
 * 
 * @example
 * ```
 * // Basic usage
 * cn('px-2 py-1', 'px-3') // Result: 'py-1 px-3'
 * 
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', {
 *   'hover-class': isHoverable,
 *   'disabled-class': isDisabled
 * })
 * 
 * // Complex combinations
 * cn(
 *   'bg-white border border-gray-200',
 *   variant === 'primary' && 'bg-blue-600 text-white',
 *   variant === 'secondary' && 'bg-gray-100 text-gray-900',
 *   size === 'lg' && 'px-6 py-3 text-lg',
 *   size === 'sm' && 'px-3 py-1.5 text-sm',
 *   disabled && 'opacity-50 cursor-not-allowed'
 * )
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format currency with enterprise-grade formatting
 * 
 * @param amount - Numeric amount to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 * 
 * @example
 * ```
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
 * ```
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format percentage with precision
 * 
 * @param value - Numeric value to format as percentage
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 * 
 * @example
 * ```
 * formatPercentage(0.1234) // "12.3%"
 * formatPercentage(0.1234, 2) // "12.34%"
 * ```
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error('Percentage formatting error:', error);
    return `${(value * 100).toFixed(decimals)}%`;
  }
}

/**
 * Format large numbers with abbreviations (K, M, B)
 * 
 * @param num - Number to format
 * @param digits - Number of decimal places (default: 1)
 * @returns Formatted number string with abbreviation
 * 
 * @example
 * ```
 * formatNumber(1234) // "1.2K"
 * formatNumber(1234567) // "1.2M"
 * formatNumber(1234567890) // "1.2B"
 * ```
 */
export function formatNumber(num: number, digits: number = 1): string {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
    { value: 1e12, symbol: "T" }
  ];
  
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

/**
 * Truncate text with ellipsis
 * 
 * @param text - Text to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 * 
 * @example
 * ```
 * truncateText("This is a very long text", 10) // "This is a..."
 * ```
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Generate initials from a name
 * 
 * @param name - Full name string
 * @returns Initials (up to 2 characters)
 * 
 * @example
 * ```
 * getInitials("John Doe") // "JD"
 * getInitials("John") // "J"
 * ```
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Validate email format
 * 
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random string for IDs
 * 
 * @param length - Length of the generated string
 * @returns Random string
 */
export function generateId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Debounce function for performance optimization
 * 
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}

// Export default for convenience
export default cn;
