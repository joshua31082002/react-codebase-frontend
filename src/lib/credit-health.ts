export type AssessmentAccount = {
  type: "revolving" | "installment";
  balanceCents: number;
  limitCents: number | null;
  openedOn: string;
  paymentStatus: "on_time" | "late";
  latePayments: number;
  isActive: boolean;
};

export type HealthFactor = {
  label: string;
  score: number;
  maximum: number;
  summary: string;
};

export type HealthAssessment = {
  score: number;
  band: "Building" | "Steady" | "Strong" | "Excellent";
  utilizationPercent: number | null;
  factors: HealthFactor[];
  actions: string[];
  isComplete: boolean;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function monthsSince(date: string) {
  const opened = new Date(`${date}T00:00:00`);
  const today = new Date();
  return Math.max(
    0,
    (today.getFullYear() - opened.getFullYear()) * 12 +
      today.getMonth() -
      opened.getMonth(),
  );
}

export function calculateHealth(
  accounts: AssessmentAccount[],
): HealthAssessment {
  const activeAccounts = accounts.filter((account) => account.isActive);
  const revolvingAccounts = activeAccounts.filter(
    (account) => account.type === "revolving",
  );
  const totalLimit = revolvingAccounts.reduce(
    (sum, account) => sum + (account.limitCents ?? 0),
    0,
  );
  const totalBalance = revolvingAccounts.reduce(
    (sum, account) => sum + account.balanceCents,
    0,
  );
  const utilizationPercent =
    totalLimit > 0 ? Math.round((totalBalance / totalLimit) * 100) : null;
  const latePaymentCount = activeAccounts.reduce(
    (sum, account) => sum + account.latePayments,
    0,
  );
  const hasLateStatus = activeAccounts.some(
    (account) => account.paymentStatus === "late",
  );
  const averageAgeMonths = activeAccounts.length
    ? activeAccounts.reduce(
        (sum, account) => sum + monthsSince(account.openedOn),
        0,
      ) / activeAccounts.length
    : 0;

  const paymentScore = clamp(
    40 - latePaymentCount * 6 - (hasLateStatus ? 8 : 0),
    0,
    40,
  );
  const utilizationScore =
    utilizationPercent === null
      ? 15
      : utilizationPercent <= 10
        ? 30
        : utilizationPercent <= 30
          ? 25
          : utilizationPercent <= 50
            ? 17
            : utilizationPercent <= 75
              ? 8
              : 2;
  const ageScore = clamp(Math.round((averageAgeMonths / 120) * 15), 0, 15);
  const types = new Set(activeAccounts.map((account) => account.type));
  const mixScore = types.size === 2 ? 10 : activeAccounts.length ? 6 : 0;
  const stabilityScore = clamp(
    activeAccounts.length * 2 + (activeAccounts.length >= 3 ? 1 : 0),
    0,
    5,
  );

  const factors = [
    {
      label: "Payment consistency",
      score: paymentScore,
      maximum: 40,
      summary:
        latePaymentCount === 0 && !hasLateStatus
          ? "No late payments recorded in this plan."
          : `${latePaymentCount} late payment${latePaymentCount === 1 ? "" : "s"} is lowering this factor.`,
    },
    {
      label: "Revolving utilization",
      score: utilizationScore,
      maximum: 30,
      summary:
        utilizationPercent === null
          ? "Add a credit limit to measure utilization accurately."
          : `${utilizationPercent}% of your recorded revolving limit is currently in use.`,
    },
    {
      label: "Account age",
      score: ageScore,
      maximum: 15,
      summary: activeAccounts.length
        ? `Your recorded active accounts average ${Math.floor(averageAgeMonths / 12)} year${Math.floor(averageAgeMonths / 12) === 1 ? "" : "s"} old.`
        : "Add active accounts to assess account age.",
    },
    {
      label: "Credit mix",
      score: mixScore,
      maximum: 10,
      summary:
        types.size === 2
          ? "Both revolving and installment accounts are represented."
          : "This plan currently includes one account type.",
    },
    {
      label: "Account stability",
      score: stabilityScore,
      maximum: 5,
      summary: `${activeAccounts.length} active account${activeAccounts.length === 1 ? "" : "s"} recorded.`,
    },
  ];
  const score = factors.reduce((sum, factor) => sum + factor.score, 0);
  const actions: string[] = [];

  if (utilizationPercent !== null && utilizationPercent > 30) {
    actions.push(
      "Prioritize reducing revolving balances below 30% of your recorded limits.",
    );
  }
  if (latePaymentCount > 0 || hasLateStatus) {
    actions.push(
      "Focus on bringing past-due accounts current and making every upcoming payment on time.",
    );
  }
  if (utilizationPercent === null) {
    actions.push(
      "Add your revolving credit limits to unlock a more useful utilization view.",
    );
  }
  if (actions.length === 0) {
    actions.push(
      "Keep balances modest and maintain on-time payments to protect this positive pattern.",
    );
  }

  return {
    score,
    band:
      score >= 85
        ? "Excellent"
        : score >= 70
          ? "Strong"
          : score >= 50
            ? "Steady"
            : "Building",
    utilizationPercent,
    factors,
    actions,
    isComplete:
      accounts.length > 0 && (revolvingAccounts.length === 0 || totalLimit > 0),
  };
}
