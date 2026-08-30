export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const hasOwn = <Key extends PropertyKey>(
  value: object,
  key: Key
): value is object & Record<Key, unknown> => Object.prototype.hasOwnProperty.call(value, key);
