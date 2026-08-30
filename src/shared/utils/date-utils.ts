const DEFAULT_DATE_FALLBACK = '—';

export type DateInput = Date | number | string;

export const formatDate = (
  value: DateInput | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  locale?: string
) => {
  if (value === null || value === undefined) {
    return DEFAULT_DATE_FALLBACK;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return DEFAULT_DATE_FALLBACK;
  }

  return new Intl.DateTimeFormat(locale, options).format(date);
};
