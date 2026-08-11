export function capitalize(value: string): string {
  if (value.length === 0) {
    return value
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

export function truncate(value: string, maxLength: number, suffix = '…'): string {
  if (value.length <= maxLength) {
    return value
  }

  const contentLength = Math.max(0, maxLength - suffix.length)
  return `${value.slice(0, contentLength).trimEnd()}${suffix}`
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
