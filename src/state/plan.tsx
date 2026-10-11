/**
 * The investment being set up on the Kosh page: amount, duration and the split.
 * Lives above the screens so it survives a trip into a fund's page and back.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { paths } from '../routes';
import type { FundId } from '../data/funds';
import { koshSplit, type Allocation } from '../lib/funds';

type PlanState = {
  /** Null means "follow Kosh's recommendation for the chosen duration" */
  amount: number | null;
  /** Null means "the duration already invested for, or Kosh's default" */
  months: number | null;
  /**
   * Investing beyond what Kosh recommends: nothing is pre-filled. The amount starts
   * at zero and the merchant picks the funds.
   */
  isExtra: boolean;
  allocations: Allocation[];
  /** True once the merchant has changed Kosh's split by hand */
  isCustom: boolean;
};

type PlanActions = {
  setAmount: (amount: number | null) => void;
  setMonths: (months: number) => void;
  setPct: (fundId: FundId, pct: number) => void;
  addFund: (fundId: FundId) => void;
  removeFund: (fundId: FundId) => void;
  resetSplit: () => void;
  /** Start an "invest more" with an empty selection */
  startExtra: () => void;
  resetPlan: () => void;
};

/**
 * Change one fund's share and keep the total at 100%: the difference is taken from
 * (or given to) the largest of the other funds, so the split is never invalid.
 */
function rebalance(allocations: Allocation[], fundId: FundId, pct: number): Allocation[] {
  const current = allocations.find((a) => a.fundId === fundId)?.pct ?? 0;
  const others = allocations.filter((a) => a.fundId !== fundId).sort((a, b) => b.pct - a.pct);
  if (!others.length) return allocations;
  const next = new Map(allocations.map((a) => [a.fundId, a.pct]));
  let delta = Math.max(0, Math.min(100, pct)) - current;
  if (delta > 0) {
    let need = delta;
    for (const o of others) {
      const take = Math.min(o.pct, need);
      next.set(o.fundId, o.pct - take);
      need -= take;
      if (!need) break;
    }
    delta -= need;
  } else {
    next.set(others[0].fundId, others[0].pct - delta);
  }
  next.set(fundId, current + delta);
  return allocations.map((a) => ({ ...a, pct: next.get(a.fundId) ?? a.pct }));
}

const start = (): PlanState => ({ amount: null, months: null, isExtra: false, allocations: koshSplit, isCustom: false });

const PlanContext = createContext<(PlanState & PlanActions) | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PlanState>(start);

  const setAmount = useCallback((amount: number | null) => setState((s) => ({ ...s, amount })), []);
  const setMonths = useCallback((months: number) => setState((s) => ({ ...s, months })), []);
  const setPct = useCallback(
    (fundId: FundId, pct: number) => setState((s) => ({ ...s, isCustom: true, allocations: rebalance(s.allocations, fundId, pct) })),
    [],
  );
  const addFund = useCallback(
    (fundId: FundId) =>
      setState((s) =>
        s.allocations.some((a) => a.fundId === fundId)
          ? s
          : // The first fund picked takes everything; later ones start at 0%
            { ...s, isCustom: true, allocations: [...s.allocations, { fundId, pct: s.allocations.length ? 0 : 100 }] },
      ),
    [],
  );
  const removeFund = useCallback(
    (fundId: FundId) =>
      setState((s) => ({ ...s, isCustom: true, allocations: rebalance(s.allocations, fundId, 0).filter((a) => a.fundId !== fundId) })),
    [],
  );
  const resetSplit = useCallback(() => setState((s) => ({ ...s, allocations: koshSplit, isCustom: false })), []);
  const startExtra = useCallback(() => setState((s) => ({ ...s, isExtra: true, amount: 0, allocations: [], isCustom: true })), []);
  const resetPlan = useCallback(() => setState(start()), []);

  const value = useMemo(
    () => ({ ...state, setAmount, setMonths, setPct, addFund, removeFund, resetSplit, startExtra, resetPlan }),
    [state, setAmount, setMonths, setPct, addFund, removeFund, resetSplit, startExtra, resetPlan],
  );
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

/**
 * Arriving on the Kosh page starts fresh: sliders back to Kosh's recommendation,
 * nothing half-set. Coming *back* to it (from a fund's page) keeps what was being set up.
 * Render this outside the animated routes: inside them, React Router reports every
 * navigation as "back".
 */
export function PlanResetOnEntry() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const { resetPlan } = usePlan();
  useEffect(() => {
    if (pathname === paths.kosh && navigationType !== 'POP') resetPlan();
  }, [pathname, navigationType, resetPlan]);
  return null;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used inside PlanProvider');
  return ctx;
}
