# Shared Utilities Documentation

This directory contains reusable utility functions organized by category: **string**, **number**, and **date** formatting utilities.

## Quick Start

```typescript
// Import any utilities using the barrel export
import { capitalize, formatCurrency, formatDate } from '@/utils';

// Use them in your components
const title = capitalize('hello world'); // 'Hello world'
const price = formatCurrency(99.99); // '$99.99'
const date = formatDate(new Date()); // 'Jan 15, 2024'
```

## Directory Structure

```
src/utils/
├── string.ts      # String manipulation & case conversion
├── number.ts      # Number & currency formatting
├── date.ts        # Date formatting & relative time
├── index.ts       # Barrel export (import from here)
├── EXAMPLES.ts    # Usage examples (for reference, can delete)
└── README.md      # This file
```

## String Utilities (`string.ts`)

Functions for string manipulation and case conversion.

| Function | Description | Example |
|----------|-------------|---------|
| `capitalize(str)` | Capitalize first letter | `capitalize('hello')` → `'Hello'` |
| `lowercase(str)` | Convert to lowercase | `lowercase('HELLO')` → `'hello'` |
| `uppercase(str)` | Convert to uppercase | `uppercase('hello')` → `'HELLO'` |
| `truncate(str, len, suffix)` | Truncate with suffix | `truncate('Hello World', 8)` → `'Hello...'` |
| `slugify(str)` | Convert to URL-safe slug | `slugify('Hello World!')` → `'hello-world'` |
| `toCamelCase(str)` | Convert to camelCase | `toCamelCase('hello-world')` → `'helloWorld'` |
| `toSnakeCase(str)` | Convert to snake_case | `toSnakeCase('helloWorld')` → `'hello_world'` |
| `toKebabCase(str)` | Convert to kebab-case | `toKebabCase('helloWorld')` → `'hello-world'` |
| `toPascalCase(str)` | Convert to PascalCase | `toPascalCase('hello-world')` → `'HelloWorld'` |
| `trimWhitespace(str)` | Remove leading/trailing spaces | `trimWhitespace('  hello  ')` → `'hello'` |
| `normalizeSpaces(str)` | Replace multiple spaces with one | `normalizeSpaces('hello    world')` → `'hello world'` |

## Number Utilities (`number.ts`)

Functions for formatting numbers, currency, percentages, and bytes.

| Function | Description | Example |
|----------|-------------|---------|
| `formatNumber(num, locale)` | Format with thousands separator | `formatNumber(1234567)` → `'1,234,567'` |
| `formatCurrency(num, currency, locale)` | Format as currency | `formatCurrency(1234.56)` → `'$1,234.56'` |
| `formatPercent(num, decimals, isDecimal)` | Format as percentage | `formatPercent(0.5)` → `'50%'` |
| `formatBytes(bytes)` | Format bytes to KB/MB/GB | `formatBytes(1048576)` → `'1 MB'` |
| `roundTo(num, decimals)` | Round to N decimal places | `roundTo(3.14159, 2)` → `3.14` |
| `formatFixed(num, decimals)` | Format to fixed decimal places | `formatFixed(3.14159, 2)` → `'3.14'` |

## Date Utilities (`date.ts`)

Functions for formatting dates and calculating time differences.

| Function | Description | Example |
|----------|-------------|---------|
| `formatDate(date, format)` | Format date to readable string | `formatDate(new Date())` → `'Jan 15, 2024'` |
| `formatRelativeTime(date)` | Format as relative time | `formatRelativeTime(1 hour ago)` → `'1 hour ago'` |
| `formatDateDifference(start, end)` | Human-readable time difference | `formatDateDifference('2024-01-01', '2024-01-10')` → `'9 days'` |
| `parseISODate(isoString)` | Parse ISO date string | `parseISODate('2024-01-15T10:30:00Z')` → `'Jan 15, 2024'` |

## Usage Examples

### In React Components

```typescript
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
```

### String Transformations

```typescript
import { slugify, capitalize, toCamelCase } from '@/utils';

const userInput = 'my blog post title';
const slug = slugify(userInput); // 'my-blog-post-title'
const title = capitalize(userInput); // 'My blog post title'
const configKey = toCamelCase(userInput); // 'myBlogPostTitle'
```

### Currency & Formatting

```typescript
import { formatCurrency, formatPercent, formatBytes } from '@/utils';

const total = formatCurrency(1299.99, 'USD'); // '$1,299.99'
const discount = formatPercent(0.15, 1); // '15.0%'
const fileSize = formatBytes(5242880); // '5 MB'
```

### Date Formatting

```typescript
import { formatDate, formatRelativeTime } from '@/utils';

const postDate = formatDate(new Date('2024-01-15')); // 'Jan 15, 2024'
const lastUpdated = formatRelativeTime(new Date()); // 'just now'
```

## Adding New Utilities

To add more utilities:

1. Create a new function in the appropriate file (`string.ts`, `number.ts`, or `date.ts`)
2. Add JSDoc documentation with examples
3. Export it in `src/utils/index.ts`
4. Update this README with usage examples

## Notes

- All utilities use native JavaScript/TypeScript — no external dependencies required
- Functions handle edge cases (invalid dates, empty strings, zero values) gracefully
- TypeScript types are fully supported with proper JSDoc annotations
- Date utilities accept both `Date` objects and ISO date strings
- Currency formatting uses browser's `Intl.NumberFormat` for locale support

## See Also

- `EXAMPLES.ts` — Full working examples of all utilities
