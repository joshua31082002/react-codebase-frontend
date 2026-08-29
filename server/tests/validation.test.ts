import { describe, expect, it } from 'vitest';
import {
  cartItemSchema,
  checkoutSchema,
  credentialsSchema,
} from '../validation/schemas.js';

describe('commerce request validation', () => {
  it('rejects weak registration credentials', () => {
    expect(
      credentialsSchema.safeParse({
        name: 'A',
        email: 'bad',
        password: 'short',
      }).success,
    ).toBe(false);
  });

  it('rejects invalid checkout fields', () => {
    expect(
      checkoutSchema.safeParse({
        fullName: '',
        email: 'bad',
        phone: '1',
        address: '',
        city: '',
      }).success,
    ).toBe(false);
  });

  it('rejects quantities outside the allowed range', () => {
    expect(
      cartItemSchema.safeParse({ productId: 3, quantity: 0 }).success,
    ).toBe(false);
    expect(
      cartItemSchema.safeParse({ productId: 3, quantity: 21 }).success,
    ).toBe(false);
  });
});
