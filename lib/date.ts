/** Parses a "YYYY-MM-DD" date string as a local Date (no timezone shift). */
export function parseISODate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

export function dateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateVN(iso: string): string {
  const date = parseISODate(iso);
  if (!date) return "";
  return date.toLocaleDateString("vi-VN");
}

/** Age in whole months as of today. */
export function ageInMonths(dob: string): number {
  const birth = parseISODate(dob);
  if (!birth) return 0;
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  return Math.max(months, 0);
}

export function formatAge(months: number): string {
  if (months < 24) return `${months} tháng tuổi`;
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return remainder === 0 ? `${years} tuổi` : `${years} tuổi ${remainder} tháng`;
}
