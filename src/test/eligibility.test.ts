import { describe, expect, it } from "vitest";
import { getDocument } from "@/data/documents";
import { ageOn, daysUntilEighteen, isEligible } from "@/lib/eligibility";

describe("eligibility rules", () => {
  it("a 17-year-old cannot get a Voter ID yet", () => {
    expect(isEligible(getDocument("voter-id")!, 17)).toBe(false);
  });
  it("an 18-year-old can get a Voter ID", () => {
    expect(isEligible(getDocument("voter-id")!, 18)).toBe(true);
  });
  it("a geared driving licence needs age 18", () => {
    expect(isEligible(getDocument("driving-licence")!, 17)).toBe(false);
    expect(isEligible(getDocument("driving-licence")!, 18)).toBe(true);
  });
  it("age is not counted up until the birthday arrives", () => {
    expect(ageOn(new Date(2008, 10, 22), new Date(2026, 10, 21))).toBe(17);
    expect(ageOn(new Date(2008, 10, 22), new Date(2026, 10, 22))).toBe(18);
  });
  it("counts days left until the 18th birthday", () => {
    expect(daysUntilEighteen(new Date(2008, 10, 22), new Date(2026, 10, 15))).toBe(7);
    expect(daysUntilEighteen(new Date(2000, 0, 1), new Date(2026, 10, 15))).toBe(0);
  });
});
