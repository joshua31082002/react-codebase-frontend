/**
 * Date formatting and manipulation utilities
 */

/**
 * Format a date to a readable string
 * @param date - The date to format (Date object or ISO string)
 * @param format - The format to use (default: 'MMM DD, YYYY')
 * @returns The formatted date string
 * @example
 * formatDate(new Date('2024-01-15')) // 'Jan 15, 2024'
 * formatDate('2024-01-15T10:30:00Z') // 'Jan 15, 2024'
 */
export function formatDate(date: Date | string, format = 'MMM DD, YYYY'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const options: Intl.DateTimeFormatOptions = {};

  if (format.includes('YYYY')) {
    options.year = 'numeric';
  }
  if (format.includes('MMM')) {
    options.month = 'short';
  } else if (format.includes('MM')) {
    options.month = '2-digit';
  }
  if (format.includes('DD')) {
    options.day = '2-digit';
  }
  if (format.includes('HH')) {
    options.hour = '2-digit';
    options.hour12 = false;
  }
  if (format.includes('mm')) {
    options.minute = '2-digit';
  }

  return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - The date to format (Date object or ISO string)
 * @returns The relative time string
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // '1 hour ago'
 * formatRelativeTime(new Date(Date.now() + 86400000)) // 'in 1 day'
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  if (Math.abs(diffSec) < 60) {
    return 'just now';
  } else if (Math.abs(diffMin) < 60) {
    return `${Math.abs(diffMin)} minute${Math.abs(diffMin) > 1 ? 's' : ''} ${diffMin > 0 ? 'from now' : 'ago'}`;
  } else if (Math.abs(diffHour) < 24) {
    return `${Math.abs(diffHour)} hour${Math.abs(diffHour) > 1 ? 's' : ''} ${diffHour > 0 ? 'from now' : 'ago'}`;
  } else if (Math.abs(diffDay) < 7) {
    return `${Math.abs(diffDay)} day${Math.abs(diffDay) > 1 ? 's' : ''} ${diffDay > 0 ? 'from now' : 'ago'}`;
  } else if (Math.abs(diffWeek) < 4) {
    return `${Math.abs(diffWeek)} week${Math.abs(diffWeek) > 1 ? 's' : ''} ${diffWeek > 0 ? 'from now' : 'ago'}`;
  } else if (Math.abs(diffMonth) < 12) {
    return `${Math.abs(diffMonth)} month${Math.abs(diffMonth) > 1 ? 's' : ''} ${diffMonth > 0 ? 'from now' : 'ago'}`;
  } else {
    return `${Math.abs(diffYear)} year${Math.abs(diffYear) > 1 ? 's' : ''} ${diffYear > 0 ? 'from now' : 'ago'}`;
  }
}

/**
 * Calculate and format the difference between two dates in human-readable format
 * @param startDate - The start date (Date object or ISO string)
 * @param endDate - The end date (Date object or ISO string)
 * @returns Human-readable time difference
 * @example
 * formatDateDifference('2024-01-01', '2024-01-10') // '9 days'
 * formatDateDifference('2024-01-01', '2024-02-01') // '1 month'
 */
export function formatDateDifference(
  startDate: Date | string,
  endDate: Date | string
): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date';
  }

  const diffMs = Math.abs(end.getTime() - start.getTime());
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  if (diffSec < 60) {
    return `${diffSec} second${diffSec > 1 ? 's' : ''}`;
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin > 1 ? 's' : ''}`;
  } else if (diffHour < 24) {
    return `${diffHour} hour${diffHour > 1 ? 's' : ''}`;
  } else if (diffDay < 7) {
    return `${diffDay} day${diffDay > 1 ? 's' : ''}`;
  } else if (diffWeek < 4) {
    return `${diffWeek} week${diffWeek > 1 ? 's' : ''}`;
  } else if (diffMonth < 12) {
    return `${diffMonth} month${diffMonth > 1 ? 's' : ''}`;
  } else {
    return `${diffYear} year${diffYear > 1 ? 's' : ''}`;
  }
}

/**
 * Parse ISO date string to readable date (alternative simpler format)
 * @param isoString - ISO date string
 * @returns Readable date string
 * @example
 * parseISODate('2024-01-15T10:30:00Z') // 'Jan 15, 2024'
 */
export function parseISODate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return formatDate(date);
}
