import { DOCUMENTS, type AdultDocument } from "@/data/documents";

export function ageOn(dob: Date, today: Date): number {
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

export function eighteenthBirthday(dob: Date): Date {
  return new Date(dob.getFullYear() + 18, dob.getMonth(), dob.getDate());
}

/** Whole days until the 18th birthday; 0 once the person is 18 or older. */
export function daysUntilEighteen(dob: Date, today: Date): number {
  const target = eighteenthBirthday(dob).getTime();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  return Math.max(0, Math.ceil((target - start) / 86_400_000));
}

export function isEligible(doc: AdultDocument, age: number): boolean {
  return age >= doc.minAge && (doc.maxAge === undefined || age <= doc.maxAge);
}

export function splitByEligibility(age: number) {
  const eligible = DOCUMENTS.filter((d) => isEligible(d, age));
  const upcoming = DOCUMENTS.filter((d) => !isEligible(d, age));
  return { eligible, upcoming };
}
