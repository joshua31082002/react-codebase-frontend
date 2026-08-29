"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAccount, removeAccount } from "@/lib/credit-service";

export type FormState = {
  message: string;
  errors?: Record<string, string[]>;
};

const accountSchema = z
  .object({
    name: z.string().trim().min(2, "Enter an account name.").max(80),
    type: z.enum(["revolving", "installment"]),
    balance: z.coerce
      .number()
      .min(0, "Balance cannot be negative.")
      .max(10_000_000),
    limit: z.coerce.number().min(0).max(10_000_000).optional(),
    openedOn: z.string().date(),
    paymentStatus: z.enum(["on_time", "late"]),
    latePayments: z.coerce.number().int().min(0).max(99),
    isActive: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.type === "revolving" && (!value.limit || value.limit <= 0)) {
      context.addIssue({
        code: "custom",
        path: ["limit"],
        message: "A revolving account needs a credit limit greater than zero.",
      });
    }
    if (new Date(`${value.openedOn}T00:00:00`) > new Date()) {
      context.addIssue({
        code: "custom",
        path: ["openedOn"],
        message: "The opened date cannot be in the future.",
      });
    }
  });

export async function saveAccount(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = accountSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    balance: formData.get("balance"),
    limit: formData.get("limit") || undefined,
    openedOn: formData.get("openedOn"),
    paymentStatus: formData.get("paymentStatus"),
    latePayments: formData.get("latePayments"),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return {
      message: "Please correct the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const value = parsed.data;
  try {
    await createAccount({
      name: value.name,
      type: value.type,
      balanceCents: Math.round(value.balance * 100),
      limitCents:
        value.type === "revolving"
          ? Math.round((value.limit ?? 0) * 100)
          : null,
      openedOn: value.openedOn,
      paymentStatus: value.paymentStatus,
      latePayments: value.latePayments,
      isActive: value.isActive,
    });
  } catch (error) {
    console.error("Unable to save credit account", error);
    return { message: "We couldn’t save that account. Please try again." };
  }

  revalidatePath("/");
  return { message: "Account saved. Your health view has been updated." };
}

export async function deleteAccount(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) return;
  await removeAccount(id);
  revalidatePath("/");
}
