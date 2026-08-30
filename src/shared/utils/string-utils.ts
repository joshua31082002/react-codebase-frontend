export const capitalize = (value: string) =>
  value.length === 0 ? value : `${value.charAt(0).toUpperCase()}${value.slice(1)}`;

export const toSentenceCase = (value: string) => {
  const normalizedValue = value.trim().replace(/[\s_-]+/g, ' ');

  return capitalize(normalizedValue.toLowerCase());
};

export const truncate = (value: string, maxLength: number, suffix = '…') => {
  if (maxLength < 0) {
    throw new RangeError('maxLength must be zero or greater');
  }

  if (value.length <= maxLength) {
    return value;
  }

  if (suffix.length >= maxLength) {
    return suffix.slice(0, maxLength);
  }

  return `${value.slice(0, maxLength - suffix.length).trimEnd()}${suffix}`;
};
