/**
 * String manipulation and case conversion utilities
 */

/**
 * Capitalize the first letter of a string
 * @param str - The string to capitalize
 * @returns The string with first letter capitalized
 * @example
 * capitalize('hello') // 'Hello'
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to lowercase
 * @param str - The string to convert
 * @returns The lowercase string
 * @example
 * lowercase('HELLO') // 'hello'
 */
export function lowercase(str: string): string {
  return str.toLowerCase();
}

/**
 * Convert string to uppercase
 * @param str - The string to convert
 * @returns The uppercase string
 * @example
 * uppercase('hello') // 'HELLO'
 */
export function uppercase(str: string): string {
  return str.toUpperCase();
}

/**
 * Truncate a string to a maximum length with optional suffix
 * @param str - The string to truncate
 * @param maxLength - Maximum length of the result (including suffix)
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns The truncated string
 * @example
 * truncate('Hello World', 8) // 'Hello...'
 * truncate('Hello World', 8, '→') // 'Hello→'
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Convert string to URL-safe slug
 * @param str - The string to convert
 * @returns The slugified string
 * @example
 * slugify('Hello World') // 'hello-world'
 * slugify('Hello  World!') // 'hello-world'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word characters
    .replace(/-+/g, '-'); // Replace multiple hyphens with single
}

/**
 * Convert string to camelCase
 * @param str - The string to convert
 * @returns The camelCase string
 * @example
 * toCamelCase('hello-world') // 'helloWorld'
 * toCamelCase('hello_world') // 'helloWorld'
 * toCamelCase('Hello World') // 'helloWorld'
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toLowerCase());
}

/**
 * Convert string to snake_case
 * @param str - The string to convert
 * @returns The snake_case string
 * @example
 * toSnakeCase('helloWorld') // 'hello_world'
 * toSnakeCase('Hello World') // 'hello_world'
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1') // Add underscore before capitals
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .toLowerCase()
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
}

/**
 * Convert string to kebab-case
 * @param str - The string to convert
 * @returns The kebab-case string
 * @example
 * toKebabCase('helloWorld') // 'hello-world'
 * toKebabCase('Hello World') // 'hello-world'
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1') // Add hyphen before capitals
    .replace(/\s+/g, '-') // Replace spaces with hyphen
    .toLowerCase()
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Convert string to PascalCase
 * @param str - The string to convert
 * @returns The PascalCase string
 * @example
 * toPascalCase('hello-world') // 'HelloWorld'
 * toPascalCase('hello_world') // 'HelloWorld'
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^(.)/, (char) => char.toUpperCase());
}

/**
 * Remove leading and trailing whitespace from a string
 * @param str - The string to trim
 * @returns The trimmed string
 * @example
 * trimWhitespace('  hello  ') // 'hello'
 */
export function trimWhitespace(str: string): string {
  return str.trim();
}

/**
 * Normalize multiple spaces to single space
 * @param str - The string to normalize
 * @returns The normalized string
 * @example
 * normalizeSpaces('hello    world') // 'hello world'
 */
export function normalizeSpaces(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}
