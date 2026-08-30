const DEFAULT_NUMBER_FALLBACK = '—';

export const formatNumber = (
  value: number | string | null | undefined,
  options?: Intl.NumberFormatOptions,
  locale?: string
) => {
  if (value === null || value === undefined || value === '') {
    return DEFAULT_NUMBER_FALLBACK;
  }

  const number = typeof value === 'number' ? value : Number(value);

  if (!Number.isFinite(number)) {
    return DEFAULT_NUMBER_FALLBACK;
  }

  return new Intl.NumberFormat(locale, options).format(number);
};

export const formatCurrency = (
  value: number | string | null | undefined,
  currency: string,
  options?: Intl.NumberFormatOptions,
  locale?: string
) =>
  formatNumber(
    value,
    {
      style: 'currency',
      currency,
      ...options,
    },
    locale
  );
