/**
 * Fund maths. Everything is computed from real NAV history; nothing is assumed.
 *
 * "Could earn" figures use each fund's pace over the last 12 months. That is a fact
 * about the past, used as an estimate: clearly labelled, never a promise.
 */
import { plan } from '../data/plan';
import { fundById, funds, type Fund, type FundId } from '../data/funds';
import { addDays, formatDay } from './dates';

export type Period = '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y';

export const periods: { id: Period; days: number; label: string }[] = [
  { id: '1M', days: 30, label: '1 month' },
  { id: '3M', days: 91, label: '3 months' },
  { id: '6M', days: 182, label: '6 months' },
  { id: '1Y', days: 365, label: '1 year' },
  { id: '3Y', days: 1096, label: '3 years' },
  { id: '5Y', days: 1826, label: '5 years' },
];
export const periodById = Object.fromEntries(periods.map((p) => [p.id, p])) as Record<Period, (typeof periods)[number]>;

const latest = (f: Fund) => f.history[f.history.length - 1];

/** NAV on `date`, or the last one before it */
function navOn(f: Fund, date: string): number | null {
  let nav: number | null = null;
  for (const [d, n] of f.history) {
    if (d > date) break;
    nav = n;
  }
  return nav;
}

/** Total return over the period, as a fraction (0.032 = 3.2%). Null if the fund is younger than the period. */
export function periodReturn(f: Fund, period: Period): number | null {
  const [lastDate, lastNav] = latest(f);
  const past = navOn(f, addDays(lastDate, -periodById[period].days));
  return past ? lastNav / past - 1 : null;
}

/** Return per year. Same as total return up to 1 year; compounded beyond. */
export function yearlyReturn(f: Fund, period: Period): number | null {
  const total = periodReturn(f, period);
  if (total === null) return null;
  const years = periodById[period].days / 365.25;
  return years <= 1 ? total : Math.pow(1 + total, 1 / years) - 1;
}

/** NAV points inside the period, for the chart */
export function navSeries(f: Fund, period: Period): { date: string; day: string; nav: number }[] {
  const from = addDays(latest(f)[0], -periodById[period].days);
  return f.history.filter(([d]) => d >= from).map(([date, nav]) => ({ date, day: formatDay(date), nav }));
}

export const latestNav = (f: Fund) => ({ date: latest(f)[0], nav: latest(f)[1] });

const lowestCache = new Map<string, number>();
/** The worst return over any `days`-long stretch in the fund's history. Positive means it never lost money over that long. */
export function lowestStretch(f: Fund, days: number): number {
  const key = `${f.id}-${days}`;
  const hit = lowestCache.get(key);
  if (hit !== undefined) return hit;
  let worst = Infinity;
  let j = 0;
  for (let i = 0; i < f.history.length; i++) {
    const cutoff = addDays(f.history[i][0], -days);
    while (j + 1 < i && f.history[j + 1][0] <= cutoff) j++;
    if (f.history[j][0] <= cutoff) worst = Math.min(worst, f.history[i][1] / f.history[j][1] - 1);
  }
  lowestCache.set(key, worst);
  return worst;
}

/* ---------- The split, and what it could earn ---------- */

export type Allocation = { fundId: FundId; pct: number };

/** Top-rated liquid fund and top-rated short-term debt fund: largest fund among the 5-star ones in each group */
const topRated = (group: Fund['group']) =>
  funds.filter((f) => f.group === group).sort((a, b) => b.rating - a.rating || b.fundSizeCr - a.fundSizeCr)[0];

/** Kosh's recommended split: half in each */
export const koshSplit: Allocation[] = [
  { fundId: topRated('liquid').id, pct: 50 },
  { fundId: topRated('debt').id, pct: 50 },
];

export const totalPct = (allocations: Allocation[]) => allocations.reduce((s, a) => s + a.pct, 0);

/** The split's return per year, at each fund's pace over the last 12 months */
export const yearlyPace = (allocations: Allocation[]) =>
  allocations.reduce((s, a) => s + (a.pct / 100) * (yearlyReturn(fundById[a.fundId], '1Y') ?? 0), 0);

/** What `amount` grows to after `days` at a yearly pace (fraction). Funds compound daily: each day's gain earns too. */
export const growTo = (amount: number, pace: number, days: number) => Math.round(amount * Math.pow(1 + pace, days / 365));

/** What `amount` could earn over `days` at a yearly pace */
export const couldEarn = (amount: number, pace: number, days: number) => growTo(amount, pace, days) - amount;

/** Same money, three places: Kosh's funds, an auto-sweep FD, the current account */
export function compare(amount: number, allocations: Allocation[], days: number) {
  const kosh = couldEarn(amount, yearlyPace(allocations), days);
  // An FD pays simple interest for the days held
  const sweepFd = Math.round((amount * (plan.sweepFdPct / 100) * days) / 365);
  return { kosh, sweepFd, idle: 0, overSweepFd: kosh - sweepFd };
}

/** Earnings month by month in three places, for the comparison graph */
export function growthSeries(amount: number, allocations: Allocation[], months: number) {
  const pace = yearlyPace(allocations);
  return Array.from({ length: months + 1 }, (_, m) => ({
    month: m === 0 ? 'Today' : `${m} mo`,
    kosh: couldEarn(amount, pace, (m * 365) / 12),
    sweepFd: Math.round((amount * (plan.sweepFdPct / 100) * m) / 12),
    idle: 0,
  }));
}

/** The investment's value month by month, for the projected-growth graph */
export function valueSeries(amount: number, pace: number, months: number) {
  return Array.from({ length: months + 1 }, (_, m) => ({ month: m === 0 ? 'Start' : `${m} mo`, value: growTo(amount, pace, (m * 365) / 12) }));
}

/** Split an amount across the plan. The largest share absorbs rounding so the parts add up exactly. */
export function splitAmount(amount: number, allocations: Allocation[]): { fundId: FundId; amount: number }[] {
  const parts = allocations.filter((a) => a.pct > 0).map((a) => ({ fundId: a.fundId, amount: Math.round((amount * a.pct) / 100) }));
  if (!parts.length) return parts;
  const diff = amount - parts.reduce((s, p) => s + p.amount, 0);
  parts.reduce((big, p) => (p.amount > big.amount ? p : big)).amount += diff;
  return parts;
}

export { funds, fundById };

/* ---------- What's already invested ---------- */

type Held = { fundId: FundId; amount: number; placedOn: string; allotOn: string };

/**
 * A holding's approximate value on `asOf`. It starts growing once units are allotted,
 * at the fund's pace over the last 12 months.
 */
export function holdingValue(h: Held, asOf: string): number {
  const days = Math.max(0, Math.round((Date.parse(asOf) - Date.parse(h.allotOn)) / 86_400_000));
  return growTo(h.amount, yearlyReturn(fundById[h.fundId], '1Y') ?? 0, days);
}

/** Holdings as a split, so the same maths works on money already invested */
export function holdingsSplit(holdings: Held[]): Allocation[] {
  const total = holdings.reduce((s, h) => s + h.amount, 0) || 1;
  return holdings.map((h) => ({ fundId: h.fundId, pct: (h.amount / total) * 100 }));
}
