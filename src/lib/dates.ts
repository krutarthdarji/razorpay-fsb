/** Date helpers on ISO date strings ("2026-11-01"). UTC maths so the day never shifts with timezone. */

const toDate = (iso: string) => new Date(`${iso}T00:00:00Z`);
const toIso = (d: Date) => d.toISOString().slice(0, 10);
const pad = (n: number) => String(n).padStart(2, '0');

/** Today's date where the user is, as an ISO string */
export function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function addDays(iso: string, days: number): string {
  const d = toDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toIso(d);
}

/** Same day, `months` later. A day the target month doesn't have (31 Nov) becomes its last day. */
export function addMonths(iso: string, months: number): string {
  const d = toDate(iso);
  const day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate();
  d.setUTCDate(Math.min(day, lastDay));
  return toIso(d);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((toDate(to).getTime() - toDate(from).getTime()) / 86_400_000);
}

/** The next weekday after `iso` (mutual fund units are allotted on working days) */
export function nextWorkingDay(iso: string): string {
  let d = addDays(iso, 1);
  while ([0, 6].includes(toDate(d).getUTCDay())) d = addDays(d, 1);
  return d;
}

/** "2026-10" */
export const monthKey = (iso: string) => iso.slice(0, 7);

/** Month keys from `from` to `to`, both included: ["2026-10", "2026-11", ...] */
export function monthsBetween(from: string, to: string): string[] {
  const keys: string[] = [];
  for (let m = `${monthKey(from)}-01`; monthKey(m) <= monthKey(to); m = addMonths(m, 1)) keys.push(monthKey(m));
  return keys;
}

/** "1 Nov" */
export function formatDay(iso: string): string {
  return toDate(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/** "Mon, 12 Oct" */
export function formatWeekday(iso: string): string {
  return toDate(iso).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/** "Nov" from "2026-11" or "2026-11-01" */
export function formatMonth(isoOrKey: string): string {
  return toDate(`${isoOrKey.slice(0, 7)}-01`).toLocaleDateString('en-IN', { month: 'short', timeZone: 'UTC' });
}

/** "6 months", "1 month" */
export const formatMonths = (n: number) => `${n} month${n === 1 ? '' : 's'}`;
