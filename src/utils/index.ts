/**
 * Barrel export for all utility functions
 * Allows clean imports: import { capitalize, formatCurrency } from '@/utils'
 */

// String utilities
export {
  capitalize,
  lowercase,
  uppercase,
  truncate,
  slugify,
  toCamelCase,
  toSnakeCase,
  toKebabCase,
  toPascalCase,
  trimWhitespace,
  normalizeSpaces,
} from './string';

// Number utilities
export {
  formatNumber,
  formatCurrency,
  formatPercent,
  formatBytes,
  roundTo,
  formatFixed,
} from './number';

// Date utilities
export {
  formatDate,
  formatRelativeTime,
  formatDateDifference,
  parseISODate,
} from './date';
