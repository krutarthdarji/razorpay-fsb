/**
 * Mocked forecast. Pure functions, no side effects.
 *
 * The idea in one line:
 *   recommended = balance - scheduled payments - spends we predict (next 45 days)
 *
 * Scheduled payments are on the calendar. Predicted spends come from the
 * merchant's own history: that is what makes the number personal.
 */
import type { CashEvent, Outflow } from '../data/types';
import { addDays, formatDay } from './dates';

/** Simple interest: amount × annual rate × days ÷ 365, rounded to the rupee */
export function earnings(amount: number, annualRatePct: number, days: number): number {
  return Math.round((amount * (annualRatePct / 100) * days) / 365);
}

export function totalOutflows(outflows: Outflow[]): number {
  return outflows.reduce((sum, o) => sum + o.amount, 0);
}

export type SafeAmount = {
  scheduled: number;
  predicted: number;
  /** Balance minus scheduled payments: what looks spare at first glance */
  surplus: number;
  /** Everything the next 45 days need: scheduled plus predicted */
  keptAside: number;
  /** What we recommend investing. Never below zero. */
  safe: number;
};

export function safeToInvest(balance: number, scheduled: Outflow[], predicted: Outflow[]): SafeAmount {
  const s = totalOutflows(scheduled);
  const p = totalOutflows(predicted);
  return {
    scheduled: s,
    predicted: p,
    surplus: balance - s,
    keptAside: s + p,
    safe: Math.max(0, balance - s - p),
  };
}

/** True when the chosen amount dips into money needed for predicted spends */
export function isAboveSafe(amount: number, safe: number): boolean {
  return amount > safe;
}

export type EarningsComparison = {
  option: number;
  sweepFd: number;
  idle: number;
  /** Extra rupees over sweep FD */
  moreThanSweepFd: number;
};

/** Rupee comparison of an option against sweep FD and idle cash */
export function compareEarnings(
  amount: number,
  days: number,
  optionRatePct: number,
  sweepFdRatePct: number,
): EarningsComparison {
  const option = earnings(amount, optionRatePct, days);
  const sweepFd = earnings(amount, sweepFdRatePct, days);
  return { option, sweepFd, idle: 0, moreThanSweepFd: option - sweepFd };
}

/* ---------- Cash flow over time (for the Home charts) ---------- */

/** Sum of events on or before `date` */
function totalUpTo(events: CashEvent[], date: string): number {
  return events.filter((e) => e.date <= date).reduce((sum, e) => sum + e.amount, 0);
}

export function outflowPayments(outflows: Outflow[]): CashEvent[] {
  return outflows.flatMap((o) => o.payments);
}

/** `day` and `month` are the week's first day, split for two-line chart labels ("8" / "Oct") */
export type WeekFlow = {
  week: string;
  day: string;
  month: string;
  moneyIn: number;
  scheduledOut: number;
  predictedOut: number;
};

/** Money in, scheduled out and predicted out per week, starting `from`, for `days` days */
export function weeklyFlows(
  inflows: CashEvent[],
  scheduled: CashEvent[],
  predicted: CashEvent[],
  from: string,
  days: number,
): WeekFlow[] {
  const weeks: WeekFlow[] = [];
  for (let start = 0; start < days; start += 7) {
    const first = addDays(from, start);
    const last = addDays(from, Math.min(start + 6, days - 1));
    const inWeek = (e: CashEvent) => e.date >= first && e.date <= last;
    const sum = (events: CashEvent[]) => events.filter(inWeek).reduce((s, e) => s + e.amount, 0);
    const [day, month] = formatDay(first).split(' ');
    weeks.push({
      week: formatDay(first),
      day,
      month,
      moneyIn: sum(inflows),
      scheduledOut: sum(scheduled),
      predictedOut: sum(predicted),
    });
  }
  return weeks;
}

export type BalancePoint = { day: string; invested: number; idle: number };

/**
 * Day-by-day account balance, with expected inflows arriving on time.
 * invested: after investing `invested` today. idle: if nothing is invested.
 */
export function projectedBalance(
  balance: number,
  invested: number,
  inflows: CashEvent[],
  outflows: CashEvent[],
  from: string,
  days: number,
): BalancePoint[] {
  const points: BalancePoint[] = [];
  for (let d = 0; d <= days; d++) {
    const date = addDays(from, d);
    const idle = balance - totalUpTo(outflows, date) + totalUpTo(inflows, date);
    points.push({ day: formatDay(date), idle, invested: idle - invested });
  }
  return points;
}
