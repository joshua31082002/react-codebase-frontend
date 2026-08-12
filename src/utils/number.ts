/**
 * Number formatting utilities for currency, percentages, bytes, and general formatting
 */

/**
 * Format a number with thousands separator
 * @param num - The number to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns The formatted number string
 * @example
 * formatNumber(1234567) // '1,234,567'
 * formatNumber(1234567, 'de-DE') // '1.234.567'
 */
export function formatNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Format a number as currency
 * @param num - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use (default: 'en-US')
 * @returns The formatted currency string
 * @example
 * formatCurrency(1234.56) // '$1,234.56'
 * formatCurrency(1234.56, 'EUR', 'de-DE') // '1.234,56 €'
 */
export function formatCurrency(
  num: number,
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(num);
}

/**
 * Format a number as a percentage
 * @param num - The number to format (0-1 or 0-100)
 * @param decimals - Number of decimal places (default: 0)
 * @param isDecimal - Whether num is 0-1 (default: true). If false, assumes 0-100
 * @returns The formatted percentage string
 * @example
 * formatPercent(0.5) // '50%'
 * formatPercent(0.156, 1) // '15.6%'
 * formatPercent(50, 0, false) // '50%'
 */
export function formatPercent(
  num: number,
  decimals = 0,
  isDecimal = true
): string {
  const value = isDecimal ? num * 100 : num;
  return value.toFixed(decimals) + '%';
}

/**
 * Format bytes to human-readable format (B, KB, MB, GB, TB)
 * @param bytes - The number of bytes to format
 * @returns The formatted bytes string
 * @example
 * formatBytes(0) // '0 B'
 * formatBytes(1024) // '1 KB'
 * formatBytes(1048576) // '1 MB'
 * formatBytes(1073741824) // '1 GB'
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Round a number to a specified number of decimal places
 * @param num - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns The rounded number
 * @example
 * roundTo(3.14159, 2) // 3.14
 * roundTo(3.14159, 3) // 3.142
 */
export function roundTo(num: number, decimals = 2): number {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Format a number to fixed decimal places
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns The formatted number string
 * @example
 * formatFixed(3.14159, 2) // '3.14'
 * formatFixed(10, 2) // '10.00'
 */
export function formatFixed(num: number, decimals = 2): string {
  return num.toFixed(decimals);
}
