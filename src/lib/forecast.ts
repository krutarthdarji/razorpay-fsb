/**
 * Kosh's forecast, as plain functions. Mocked data in, numbers out.
 *
 * How Kosh reaches a recommendation:
 *   1. Project the balance day by day from every stream it tracks.
 *   2. Find the lowest point over the chosen duration.
 *   3. Keep a cushion for surprises. Recommend the rest.
 * A longer duration can only lower the lowest point, so the recommendation shrinks.
 */
import type { Stream, YearlyItem } from '../data/types';
import { addDays, addMonths, daysBetween, formatDay, monthKey, monthsBetween } from './dates';

/** Simple interest: amount × annual rate × days ÷ 365, rounded to the rupee */
export function earnings(amount: number, annualRatePct: number, days: number): number {
  return Math.round((amount * (annualRatePct / 100) * days) / 365);
}

export type CashEvent = { id: string; label: string; date: string; amount: number; kind: 'in' | 'out'; source?: string };

const pad = (n: number) => String(n).padStart(2, '0');

/** Every movement between `from` and `to` (both included), oldest first */
export function eventsBetween(
  streams: { in: Stream[]; out: Stream[] },
  yearly: { in: YearlyItem[]; out: YearlyItem[] },
  from: string,
  to: string,
): CashEvent[] {
  const events: CashEvent[] = [];
  const add = (id: string, label: string, date: string, amount: number, kind: CashEvent['kind'], source: string) => {
    if (date >= from && date <= to) events.push({ id: `${id}-${date}`, label, date, amount, kind, source });
  };
  for (const month of monthsBetween(from, to)) {
    for (const kind of ['in', 'out'] as const) {
      for (const s of streams[kind]) add(s.id, s.label, `${month}-${pad(s.dayOfMonth)}`, s.amount(month), kind, s.source);
      for (const y of yearly[kind]) if (y.month === Number(month.slice(5, 7))) add(y.id, y.label, `${month}-${pad(y.day)}`, y.amount, kind, y.source);
    }
  }
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export const net = (events: CashEvent[]) => events.reduce((s, e) => s + (e.kind === 'in' ? e.amount : -e.amount), 0);

export type BalancePoint = { date: string; day: string; balance: number };

/** Balance at the end of each day, from `from` (day 0) to `to` */
export function dailyBalance(start: number, events: CashEvent[], from: string, to: string): BalancePoint[] {
  const points: BalancePoint[] = [];
  let balance = start;
  for (let d = 0; d <= daysBetween(from, to); d++) {
    const date = addDays(from, d);
    for (const e of events) if (e.date === date) balance += e.kind === 'in' ? e.amount : -e.amount;
    points.push({ date, day: formatDay(date), balance });
  }
  return points;
}

/** The lowest balance on or before `until` */
export function lowestPoint(points: BalancePoint[], until: string): BalancePoint {
  return points.filter((p) => p.date <= until).reduce((low, p) => (p.balance < low.balance ? p : low));
}

/** Most that can be invested for `months` without the balance dipping into the cushion */
export function freeFor(points: BalancePoint[], today: string, months: number, cushion: number): number {
  return Math.max(0, lowestPoint(points, addMonths(today, months)).balance - cushion);
}

export type MonthRow = { month: string; moneyIn: number; moneyOut: number; net: number; closing: number };

/** Month-by-month money in, money out, net and closing balance */
export function monthlyProjection(start: number, events: CashEvent[], months: string[]): MonthRow[] {
  let balance = start;
  return months.map((month) => {
    const inMonth = events.filter((e) => monthKey(e.date) === month);
    const moneyIn = inMonth.filter((e) => e.kind === 'in').reduce((s, e) => s + e.amount, 0);
    const moneyOut = inMonth.filter((e) => e.kind === 'out').reduce((s, e) => s + e.amount, 0);
    balance += moneyIn - moneyOut;
    return { month, moneyIn, moneyOut, net: moneyIn - moneyOut, closing: balance };
  });
}

export const roundDown = (amount: number, step: number) => Math.floor(amount / step) * step;

/** Payments, up to `until`, that would need some of the invested money back */
export function paymentsNeedingIt(points: BalancePoint[], events: CashEvent[], invested: number, cushion: number, until: string): CashEvent[] {
  const short = new Set(points.filter((p) => p.date <= until && p.balance - invested < cushion).map((p) => p.date));
  return events.filter((e) => e.kind === 'out' && short.has(e.date));
}
