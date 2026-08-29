import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  address: z.string().trim().min(5).max(160),
  city: z.string().trim().min(2).max(80),
  postalCode: z.string().trim().min(3).max(12),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(12),
      }),
    )
    .min(1)
    .max(20),
});
