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
