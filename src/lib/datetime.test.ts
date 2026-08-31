import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { expandOccurrences, minutesBetween } from "../lib/datetime";
import { MAX_RECURRENCE_OCCURRENCES } from "../lib/constants";

describe("datetime helpers", () => {
  it("counts minutes between two instants", () => {
    const start = new Date("2026-09-01T09:00:00Z");
    const end = new Date("2026-09-01T10:30:00Z");
    assert.equal(minutesBetween(start, end), 90);
  });

  it("expands a weekly series without exceeding the cap", () => {
    const start = new Date("2026-09-01T09:00:00Z");
    const end = new Date("2026-09-01T10:00:00Z");
    const occurrences = expandOccurrences(start, end, "weekly", MAX_RECURRENCE_OCCURRENCES);
    assert.equal(occurrences.length, 13);
    assert.equal(occurrences[12].start.toISOString(), "2026-11-24T09:00:00.000Z");
  });
});
