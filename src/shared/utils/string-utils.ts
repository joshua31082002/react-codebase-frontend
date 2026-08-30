const DEFAULT_STRING_FALLBACK = '—';

export const toSafeString = (
  value: string | number | boolean | null | undefined,
  fallback = DEFAULT_STRING_FALLBACK
) => {
  if (value === null || value === undefined) {
    return fallback;
  }

  return String(value);
};

export const isBlank = (value: string | null | undefined): value is null | undefined | '' =>
  value === null || value === undefined || value.trim() === '';

export const capitalize = (
  value: string | null | undefined,
  fallback = DEFAULT_STRING_FALLBACK
) => {
  if (isBlank(value)) {
    return fallback;
  }

  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
};
