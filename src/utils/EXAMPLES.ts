/**
 * UTILS USAGE EXAMPLES
 *
 * This file demonstrates how to use all utility functions.
 * You can delete this file after reviewing — it's for reference only.
 */

import {
  // String utilities
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

  // Number utilities
  formatNumber,
  formatCurrency,
  formatPercent,
  formatBytes,
  roundTo,
  formatFixed,

  // Date utilities
  formatDate,
  formatRelativeTime,
  formatDateDifference,
  parseISODate,
} from '@/utils';

// ============================================
// STRING UTILITIES EXAMPLES
// ============================================

console.log('=== STRING UTILITIES ===');

console.log('capitalize("hello world"):', capitalize('hello world'));
// Output: "Hello world"

console.log('lowercase("HELLO"):', lowercase('HELLO'));
// Output: "hello"

console.log('uppercase("hello"):', uppercase('hello'));
// Output: "HELLO"

console.log('truncate("Hello World", 8):', truncate('Hello World', 8));
// Output: "Hello..."

console.log('slugify("Hello World!"):', slugify('Hello World!'));
// Output: "hello-world"

console.log('toCamelCase("hello-world"):', toCamelCase('hello-world'));
// Output: "helloWorld"

console.log('toSnakeCase("helloWorld"):', toSnakeCase('helloWorld'));
// Output: "hello_world"

console.log('toKebabCase("helloWorld"):', toKebabCase('helloWorld'));
// Output: "hello-world"

console.log('toPascalCase("hello-world"):', toPascalCase('hello-world'));
// Output: "HelloWorld"

console.log('normalizeSpaces("hello    world"):', normalizeSpaces('hello    world'));
// Output: "hello world"

// ============================================
// NUMBER UTILITIES EXAMPLES
// ============================================

console.log('\n=== NUMBER UTILITIES ===');

console.log('formatNumber(1234567):', formatNumber(1234567));
// Output: "1,234,567"

console.log('formatCurrency(1234.56):', formatCurrency(1234.56));
// Output: "$1,234.56"

console.log('formatCurrency(1234.56, "EUR", "de-DE"):', formatCurrency(1234.56, 'EUR', 'de-DE'));
// Output: "1.234,56 €"

console.log('formatPercent(0.5):', formatPercent(0.5));
// Output: "50%"

console.log('formatPercent(0.156, 1):', formatPercent(0.156, 1));
// Output: "15.6%"

console.log('formatBytes(1048576):', formatBytes(1048576));
// Output: "1 MB"

console.log('roundTo(3.14159, 2):', roundTo(3.14159, 2));
// Output: 3.14

console.log('formatFixed(3.14159, 2):', formatFixed(3.14159, 2));
// Output: "3.14"

// ============================================
// DATE UTILITIES EXAMPLES
// ============================================

console.log('\n=== DATE UTILITIES ===');

const exampleDate = new Date('2024-01-15');
console.log('formatDate(new Date("2024-01-15")):', formatDate(exampleDate));
// Output: "Jan 15, 2024"

const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
console.log('formatRelativeTime(1 hour ago):', formatRelativeTime(pastDate));
// Output: "1 hour ago"

const futureDate = new Date(Date.now() + 86400000); // 1 day from now
console.log('formatRelativeTime(1 day from now):', formatRelativeTime(futureDate));
// Output: "in 1 day"

console.log('formatDateDifference("2024-01-01", "2024-01-10"):', formatDateDifference('2024-01-01', '2024-01-10'));
// Output: "9 days"

console.log('parseISODate("2024-01-15T10:30:00Z"):', parseISODate('2024-01-15T10:30:00Z'));
// Output: "Jan 15, 2024"

// ============================================
// USAGE IN REACT COMPONENTS
// ============================================

/*
// Example in a React component:

import { formatCurrency, formatDate, truncate } from '@/utils';

export function ProductCard({ product }) {
  return (
    <div>
      <h2>{truncate(product.name, 30)}</h2>
      <p>Price: {formatCurrency(product.price)}</p>
      <p>Added: {formatDate(product.createdAt)}</p>
    </div>
  );
}

// Example with state:

import { useState } from 'react';
import { slugify, capitalize } from '@/utils';

export function BlogPost({ title }) {
  const slug = slugify(title);
  const displayTitle = capitalize(title);

  return (
    <article>
      <h1>{displayTitle}</h1>
      <p>URL slug: /{slug}</p>
    </article>
  );
}
*/
