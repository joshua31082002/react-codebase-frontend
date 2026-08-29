import assert from "node:assert/strict";
import test from "node:test";
import { calculateHealth } from "./credit-health";

const baseAccount = {
  type: "revolving" as const,
  balanceCents: 50000,
  limitCents: 500000,
  openedOn: "2020-01-01",
  paymentStatus: "on_time" as const,
  latePayments: 0,
  isActive: true,
};

test("rewards low utilization and on-time payments", () => {
  const assessment = calculateHealth([baseAccount]);

  assert.equal(assessment.utilizationPercent, 10);
  assert.equal(assessment.factors[0].score, 40);
  assert.equal(assessment.factors[1].score, 30);
  assert.equal(assessment.band, "Strong");
});

test("penalizes late payments and high utilization", () => {
  const assessment = calculateHealth([
    {
      ...baseAccount,
      balanceCents: 475000,
      latePayments: 2,
      paymentStatus: "late",
    },
  ]);

  assert.equal(assessment.utilizationPercent, 95);
  assert.equal(assessment.factors[0].score, 20);
  assert.equal(assessment.factors[1].score, 2);
  assert.ok(assessment.score < 50);
});

test("marks missing revolving limits as incomplete", () => {
  const assessment = calculateHealth([{ ...baseAccount, limitCents: null }]);

  assert.equal(assessment.utilizationPercent, null);
  assert.equal(assessment.isComplete, false);
  assert.match(assessment.actions[0], /credit limits/i);
});
