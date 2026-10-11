/**
 * Kosh's view of Ravi's money, built from the data Razorpay already tracks.
 *
 * Two things live here:
 * - The current picture (balance, what's coming in and going out). It follows one date,
 *   `plan.today`. `setToday` moves that date (the demo's fast-forward) and recomputes it.
 * - The cycle: Kosh's recommendation, made once on the day the demo starts. It does not
 *   change as the clock moves, and the demo ends when the cycle does.
 */
import {
  balanceAnchor,
  cushionBasis,
  expenseStreams,
  plan,
  revenueStreams,
  termFeeIds,
  yearlyInflows,
  yearlyOutflows,
} from '../data';
import { addDays, addMonths, daysBetween, monthKey, monthsBetween, nextWorkingDay } from './dates';
import {
  dailyBalance,
  eventsBetween,
  freeFor,
  lowestPoint,
  monthlyProjection,
  net,
  paymentsNeedingIt,
  roundDown,
  type BalancePoint,
  type CashEvent,
  type MonthRow,
} from './forecast';

const streams = { in: revenueStreams, out: expenseStreams };
const yearly = { in: yearlyInflows, out: yearlyOutflows };

/** Every movement between two dates, both included */
export const flowsBetween = (from: string, to: string) => eventsBetween(streams, yearly, from, to);
export const sum = (items: { amount: number }[]) => items.reduce((s, i) => s + i.amount, 0);
const isTermFee = (e: CashEvent) => termFeeIds.some((id) => e.id.startsWith(id));

/** Kosh's recommended cushion for surprises */
export const cushion = cushionBasis.reduce((s, c) => s + c.amount, 0);

/** The account balance on a date, before any investing: one known point plus everything since */
export const balanceOn = (date: string) =>
  date >= balanceAnchor.date
    ? balanceAnchor.balance + net(flowsBetween(addDays(balanceAnchor.date, 1), date))
    : balanceAnchor.balance - net(flowsBetween(addDays(date, 1), balanceAnchor.date));

/* ---------- The current picture. Reassigned by setToday(). ---------- */

/** The account balance today, before any investing */
export let balanceToday = 0;
/** Everything Kosh expects to come in and go out, from tomorrow to 12 months out */
export let events: CashEvent[] = [];
/** Projected balance each day, if nothing is invested */
export let projection: BalancePoint[] = [];
/** One row per month, this month (the rest of it) first */
export let monthly: MonthRow[] = [];
/** Kosh's recommendation as it stands today: the cycle's amount, for the time the cycle has left */
export let recommendation = {} as {
  amount: number;
  months: number;
  days: number;
  until: string;
  lowest: BalancePoint;
  cushion: number;
  /** When units are allotted for an order placed today */
  allotmentDate: string;
};
/** This month, as tracked by Razorpay: done up to today, expected after */
export let thisMonth = {} as { key: string; revenueReceived: CashEvent[]; revenueUpcoming: CashEvent[]; expensesPaid: CashEvent[]; expensesDue: CashEvent[] };
/** The last three full months: what came in and went out */
export let pastMonths: { month: string; revenue: number; expenses: number }[] = [];
/** A typical month between terms, and the next big refill */
export let totals = {} as { revenuePerMonth: number; expensesPerMonth: number; nextTermFees: CashEvent };

export const untilDate = (months: number) => addMonths(plan.today, months);
export const daysIn = (months: number) => daysBetween(plan.today, untilDate(months));

/** What Kosh would recommend investing for this many months, starting today */
const recommendedFor = (months: number) => roundDown(freeFor(projection, plan.today, months, cushion), plan.roundTo);

/* ---------- The cycle. Set once, on the day the demo starts. ---------- */

/**
 * The one cycle this demo plays out: what Kosh recommends on the day the demo starts,
 * for `plan.recommendMonths`. Kosh looked across the whole cycle to reach the amount
 * (the lowest balance on the way, less its cushion), so the amount holds until the
 * cycle ends. Moving the clock never changes it.
 */
export let cycle = {} as {
  start: string;
  until: string;
  months: number;
  days: number;
  amount: number;
  lowest: BalancePoint;
  cushion: number;
  allotmentDate: string;
  /** The balance on the day the cycle starts, before investing */
  startBalance: number;
  /** Projected balance each day of the cycle, if nothing is invested */
  projection: BalancePoint[];
  /** The same, for the 12 months Kosh looks ahead */
  outlook: BalancePoint[];
  monthly: MonthRow[];
  totals: typeof totals;
  /** What Kosh would have recommended for other durations */
  byDuration: { months: number; amount: number }[];
  /** The date each month of the cycle ends. The last one ends the cycle. */
  stops: string[];
};

/** Full months of the cycle that have passed */
export const cycleMonthsDone = () => cycle.stops.filter((d) => d <= plan.today).length;
/** Months the cycle has left (never less than 1, for wording) */
export const cycleMonthsLeft = () => Math.max(1, cycle.months - cycleMonthsDone());
export const cycleFinished = () => plan.today >= cycle.until;
/** Where the next one-month fast-forward lands. Null once the cycle is over. */
export const nextCycleStop = () => cycle.stops.find((d) => d > plan.today) ?? null;

function startCycle() {
  const months = plan.recommendMonths;
  const until = untilDate(months);
  cycle = {
    start: plan.today,
    until,
    months,
    days: daysIn(months),
    amount: recommendedFor(months),
    lowest: lowestPoint(projection, until),
    cushion,
    allotmentDate: nextWorkingDay(plan.today),
    startBalance: balanceToday,
    projection: projection.filter((p) => p.date <= until),
    outlook: projection,
    monthly: monthly.slice(0, months),
    totals,
    byDuration: [3, 6, 9, 12].map((m) => ({ months: m, amount: recommendedFor(m) })),
    stops: Array.from({ length: months }, (_, i) => addMonths(plan.today, i + 1)),
  };
}

/**
 * The most that can be invested right now, on top of what already is: whatever the
 * account can spare for the next month after Kosh's cushion. Anything more would be
 * needed back within weeks.
 */
export const maxInvestable = (totalInvested: number) =>
  Math.max(0, roundDown(freeFor(projection, plan.today, 1, cushion), plan.slider.step) - totalInvested);

/** Payments that would need money back if `totalInvested` stays in until the cycle ends */
export const paymentsAtStake = (totalInvested: number) => paymentsNeedingIt(projection, events, totalInvested, cushion, cycle.until);

export type Standing = 'none' | 'under' | 'at' | 'over';

/**
 * Compares what's invested with what Kosh recommends for the cycle.
 * The gap is rounded to the slider step: a partial withdrawal leaves odd rupees
 * behind, and "invest ₹1,00,000 more" is clearer than "₹99,456 more".
 */
export function standing(totalInvested: number) {
  const recommended = cycle.amount;
  const step = plan.slider.step;
  const gap = Math.round((recommended - totalInvested) / step) * step;
  const status: Standing = totalInvested === 0 ? 'none' : gap > 0 ? 'under' : gap === 0 ? 'at' : 'over';
  return { status, recommended, remaining: Math.max(0, gap), excess: Math.max(0, -gap) };
}

/** Move "today" and recompute everything that follows from it */
export function setToday(today: string) {
  plan.today = today;
  const horizonEnd = addMonths(today, plan.maxMonths);

  balanceToday = balanceOn(today);
  events = flowsBetween(addDays(today, 1), horizonEnd);
  projection = dailyBalance(balanceToday, events, today, horizonEnd);
  monthly = monthlyProjection(balanceToday, events, monthsBetween(today, horizonEnd));

  const monthStart = `${monthKey(today)}-01`;
  const thisMonthEvents = flowsBetween(monthStart, addDays(addMonths(monthStart, 1), -1));
  const done = (e: CashEvent) => e.date <= today;
  thisMonth = {
    key: monthKey(today),
    revenueReceived: thisMonthEvents.filter((e) => e.kind === 'in' && done(e)),
    revenueUpcoming: thisMonthEvents.filter((e) => e.kind === 'in' && !done(e)),
    expensesPaid: thisMonthEvents.filter((e) => e.kind === 'out' && done(e)),
    expensesDue: thisMonthEvents.filter((e) => e.kind === 'out' && !done(e)),
  };

  pastMonths = [3, 2, 1].map((back) => {
    const start = addMonths(monthStart, -back);
    const month = flowsBetween(start, addDays(addMonths(start, 1), -1));
    return { month: monthKey(start), revenue: sum(month.filter((e) => e.kind === 'in')), expenses: sum(month.filter((e) => e.kind === 'out')) };
  });

  const nextSix = events.filter((e) => e.date <= untilDate(6));
  totals = {
    revenuePerMonth: Math.round(sum(nextSix.filter((e) => e.kind === 'in' && !isTermFee(e))) / 6 / 1000) * 1000,
    expensesPerMonth: Math.round(sum(nextSix.filter((e) => e.kind === 'out')) / 6 / 1000) * 1000,
    nextTermFees: events.find(isTermFee)!,
  };

  // The first call is the day the demo starts: that is when Kosh makes its recommendation
  if (!cycle.start) startCycle();
  recommendation = {
    amount: cycle.amount,
    months: cycleMonthsLeft(),
    days: Math.max(1, daysBetween(today, cycle.until)),
    until: cycle.until,
    lowest: cycle.lowest,
    cushion,
    allotmentDate: nextWorkingDay(today),
  };
}

setToday(plan.today);
