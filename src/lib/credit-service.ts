import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { creditAccounts, profiles, type CreditAccount } from "@/db/schema";
import { calculateHealth } from "@/lib/credit-health";

const now = () => new Date().toISOString();

const sampleAccounts = [
  {
    name: "Harbor Rewards Card",
    type: "revolving" as const,
    balanceCents: 124500,
    limitCents: 600000,
    openedOn: "2019-04-12",
    paymentStatus: "on_time" as const,
    latePayments: 0,
    isActive: true,
  },
  {
    name: "Northline Auto Loan",
    type: "installment" as const,
    balanceCents: 814000,
    limitCents: null,
    openedOn: "2021-08-30",
    paymentStatus: "on_time" as const,
    latePayments: 0,
    isActive: true,
  },
];

export async function getOrCreateProfile() {
  const [profile] = await db.select().from(profiles).limit(1);
  if (profile) return profile;

  const created = await db
    .insert(profiles)
    .values({ createdAt: now() })
    .returning();
  const newProfile = created[0];

  await db.insert(creditAccounts).values(
    sampleAccounts.map((account) => ({
      ...account,
      profileId: newProfile.id,
      createdAt: now(),
      updatedAt: now(),
    })),
  );

  return newProfile;
}

export async function getCreditDashboard() {
  const profile = await getOrCreateProfile();
  const accounts = await db
    .select()
    .from(creditAccounts)
    .where(eq(creditAccounts.profileId, profile.id));

  return { accounts, assessment: calculateHealth(accounts) };
}

export async function createAccount(
  account: Omit<CreditAccount, "id" | "profileId" | "createdAt" | "updatedAt">,
) {
  const profile = await getOrCreateProfile();
  const [created] = await db
    .insert(creditAccounts)
    .values({
      ...account,
      profileId: profile.id,
      createdAt: now(),
      updatedAt: now(),
    })
    .returning();
  return created;
}

export async function removeAccount(id: number) {
  const profile = await getOrCreateProfile();
  await db
    .delete(creditAccounts)
    .where(
      and(eq(creditAccounts.id, id), eq(creditAccounts.profileId, profile.id)),
    );
}
