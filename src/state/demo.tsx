/**
 * Demo state shared across app screens: what's invested, until when, and the demo clock.
 *
 * The demo plays one cycle: Kosh's recommendation, from the day it is made to the day
 * it ends (see `cycle` in lib/recommendation). The clock only moves while the merchant
 * is invested as Kosh recommends, a month at a time, and stops when the cycle ends.
 *
 * The balance is never stored. It follows from the date and what's invested:
 *   balance = balance the account would have had - money still invested + gains already withdrawn
 * Kept in sessionStorage so a refresh doesn't lose the demo.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { plan } from '../data';
import type { FundId } from '../data/funds';
import { addDays, addMonths, daysBetween, nextWorkingDay, todayIso } from '../lib/dates';
import type { CashEvent } from '../lib/forecast';
import { fundById, holdingValue } from '../lib/funds';
import { balanceOn, cycle, cycleFinished, cycleMonthsDone, flowsBetween, nextCycleStop, setToday, standing } from '../lib/recommendation';

export type Holding = { fundId: FundId; amount: number; placedOn: string; allotOn: string };
export type OrderItem = { fundId: FundId; amount: number };
export type Order = { amount: number; items: OrderItem[]; months: number; seconds: number | null; placedOn: string; allotOn: string };

/** What happened during a fast-forward, for the summary shown afterwards */
export type Jump = {
  kind: 'allotment' | 'month';
  from: string;
  to: string;
  events: CashEvent[];
  balanceBefore: number;
  balanceAfter: number;
  valueBefore: number;
  valueAfter: number;
};

type State = {
  holdings: Holding[];
  /** The date the merchant chose to stay invested until. Null when nothing is invested. */
  until: string | null;
  /** Earnings already paid into the account by withdrawals */
  gainsWithdrawn: number;
  /** How far the demo clock is ahead of the real date */
  daysAhead: number;
  /** The last fast-forward, until its summary has been read */
  lastJump: Jump | null;
  /** When the merchant first acted on the nudge (ms since epoch) */
  flowStartedAt: number | null;
  lastOrder: Order | null;
};

type Actions = {
  startFlow: () => void;
  /** Place one order across several funds. `keepPeriod` adds to the current investment period instead of starting a new one. */
  invest: (items: OrderItem[], months: number, keepPeriod?: boolean) => void;
  /** Take `credited` rupees out of one fund, or out of all of them in proportion (`fundId` null) */
  withdraw: (fundId: FundId | null, credited: number) => void;
  /** Move the demo clock to the day units are allotted */
  skipToAllotment: () => void;
  /** Move the demo clock to the end of the cycle's next month */
  skipMonth: () => void;
  dismissJump: () => void;
  reset: () => void;
};

type Derived = {
  today: string;
  totalInvested: number;
  /** Approximate value of everything invested, today */
  value: number;
  /** Approximate earnings so far, including what has already been withdrawn */
  earned: number;
  balance: number;
  /** Invested exactly as Kosh recommends. The clock only moves while this holds. */
  asRecommended: boolean;
  /** Full months of the cycle that have passed */
  cycleMonth: number;
  /** The cycle is over: the demo ends here */
  finished: boolean;
  /** Whole months left in the chosen investment period (at least 1 while it runs) */
  monthsLeft: number | null;
  /** The chosen period is over */
  matured: boolean;
  /** The day units for the newest order are allotted, while that is still ahead */
  pendingAllotment: string | null;
};

/** Bump when the stored shape changes, so old sessions start clean */
const KEY = 'kosh-demo-v7';
/** Session flags other parts of the demo set (e.g. the agent's typing beat) */
export const SESSION_FLAGS = ['kosh-typed'];

const initial: State = { holdings: [], until: null, gainsWithdrawn: 0, daysAhead: 0, lastJump: null, flowStartedAt: null, lastOrder: null };

const isDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const isAmount = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
const isHolding = (h: Holding) => !!h && h.fundId in fundById && isAmount(h.amount) && h.amount > 0 && isDate(h.placedOn) && isDate(h.allotOn);

/** A saved session is only used if every part of it is sound. Anything else starts the demo clean. */
function load(): State {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return initial;
    const s: State = { ...initial, ...JSON.parse(raw) };
    const sound =
      Array.isArray(s.holdings) &&
      s.holdings.every(isHolding) &&
      (s.until === null || isDate(s.until)) &&
      Number.isFinite(s.gainsWithdrawn) &&
      Number.isInteger(s.daysAhead) &&
      s.daysAhead >= 0 &&
      // The clock never runs past the end of the cycle
      addDays(todayIso(), s.daysAhead) <= cycle.until &&
      (s.lastOrder === null || (Array.isArray(s.lastOrder.items) && isAmount(s.lastOrder.amount) && isDate(s.lastOrder.placedOn) && isDate(s.lastOrder.allotOn))) &&
      (s.lastJump === null || (Array.isArray(s.lastJump.events) && isDate(s.lastJump.from) && isDate(s.lastJump.to)));
    return sound ? s : initial;
  } catch {
    return initial;
  }
}

const invested = (holdings: Holding[]) => holdings.reduce((t, h) => t + h.amount, 0);
const valueOn = (holdings: Holding[], date: string) => holdings.reduce((t, h) => t + holdingValue(h, date), 0);

/**
 * Take `credited` rupees (at `date`'s values) out of the chosen holdings.
 * Each holding gives up the same share of itself; the gain part is counted as withdrawn earnings.
 */
function takeOut(s: State, fundId: FundId | null, credited: number, date: string): State {
  const targets = s.holdings.filter((h) => fundId === null || h.fundId === fundId);
  const targetValue = valueOn(targets, date);
  if (targetValue <= 0 || credited <= 0) return s;
  const share = Math.min(1, credited / targetValue);
  let principalOut = 0;
  const holdings = s.holdings
    .map((h) => {
      if (!targets.includes(h)) return h;
      const out = share === 1 ? h.amount : Math.round(h.amount * share);
      principalOut += out;
      return { ...h, amount: h.amount - out };
    })
    .filter((h) => h.amount > 0);
  const paid = Math.round(targetValue * share);
  return { ...s, holdings, until: holdings.length ? s.until : null, gainsWithdrawn: s.gainsWithdrawn + (paid - principalOut) };
}

/**
 * Advance the clock to `to`, with everything that happens on the way.
 * Only while invested as Kosh recommends, and never past the end of the cycle. On that
 * path no payment ever needs the invested money: Kosh's amount already leaves the
 * lowest balance of the cycle, and its cushion, in the account.
 */
function jump(s: State, target: string, kind: Jump['kind']): State {
  const from = plan.today;
  const to = target > cycle.until ? cycle.until : target;
  if (to <= from || standing(invested(s.holdings)).status !== 'at') return s;
  const flows = flowsBetween(addDays(from, 1), to);
  const available = (date: string) => balanceOn(date) - invested(s.holdings) + s.gainsWithdrawn;

  return {
    ...s,
    daysAhead: s.daysAhead + daysBetween(from, to),
    lastJump: {
      kind,
      from,
      to,
      events: flows,
      balanceBefore: available(from),
      balanceAfter: available(to),
      valueBefore: valueOn(s.holdings, from),
      valueAfter: valueOn(s.holdings, to),
    },
  };
}

const DemoContext = createContext<(State & Actions & Derived) | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(load);

  // The clock drives every projection. Keep it in step before anything below renders.
  const today = addDays(todayIso(), state.daysAhead);
  if (plan.today !== today) setToday(today);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage blocked: the demo still works in memory */
    }
  }, [state]);

  const startFlow = useCallback(() => setState((s) => (s.flowStartedAt ? s : { ...s, flowStartedAt: Date.now() })), []);

  const invest = useCallback((items: OrderItem[], months: number, keepPeriod = false) => {
    setState((s) => {
      if (cycleFinished()) return s;
      const amount = items.reduce((t, i) => t + i.amount, 0);
      const allotOn = nextWorkingDay(plan.today);
      // Each order is its own lot, so its units are allotted (and start growing) on its own day
      const holdings = [...s.holdings, ...items.map((i) => ({ fundId: i.fundId, amount: i.amount, placedOn: plan.today, allotOn }))];
      const seconds = s.flowStartedAt ? Math.round((Date.now() - s.flowStartedAt) / 1000) : null;
      const until = keepPeriod && s.until && s.until > plan.today ? s.until : addMonths(plan.today, months);
      return { ...s, holdings, until, flowStartedAt: null, lastOrder: { amount, items, months, seconds, placedOn: plan.today, allotOn } };
    });
  }, []);

  const withdraw = useCallback((fundId: FundId | null, credited: number) => setState((s) => takeOut(s, fundId, credited, plan.today)), []);

  const skipToAllotment = useCallback(
    () =>
      setState((s) => {
        const pending = s.holdings.map((h) => h.allotOn).filter((d) => d > plan.today).sort();
        return pending.length ? jump(s, pending[pending.length - 1], 'allotment') : s;
      }),
    [],
  );
  const skipMonth = useCallback(
    () =>
      setState((s) => {
        const stop = nextCycleStop();
        return stop ? jump(s, stop, 'month') : s;
      }),
    [],
  );
  const dismissJump = useCallback(() => setState((s) => ({ ...s, lastJump: null })), []);

  const reset = useCallback(() => {
    try {
      SESSION_FLAGS.forEach((f) => sessionStorage.removeItem(f));
    } catch {
      /* fine */
    }
    setState(initial);
  }, []);

  const value = useMemo(() => {
    const totalInvested = invested(state.holdings);
    const pending = state.holdings.map((h) => h.allotOn).filter((d) => d > today).sort();
    const daysLeft = state.until ? daysBetween(today, state.until) : null;
    return {
      ...state,
      today,
      totalInvested,
      value: valueOn(state.holdings, today),
      earned: Math.max(0, valueOn(state.holdings, today) - totalInvested + state.gainsWithdrawn),
      balance: balanceOn(today) - totalInvested + state.gainsWithdrawn,
      asRecommended: standing(totalInvested).status === 'at',
      cycleMonth: cycleMonthsDone(),
      finished: cycleFinished(),
      monthsLeft: daysLeft === null ? null : Math.max(1, Math.round(daysLeft / 30.44)),
      matured: daysLeft !== null && daysLeft <= 0,
      pendingAllotment: pending.length ? pending[pending.length - 1] : null,
      startFlow,
      invest,
      withdraw,
      skipToAllotment,
      skipMonth,
      dismissJump,
      reset,
    };
  }, [state, today, startFlow, invest, withdraw, skipToAllotment, skipMonth, dismissJump, reset]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider');
  return ctx;
}
