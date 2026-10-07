/**
 * Demo state shared across app screens: balance, the investment, and how long
 * the flow took. Kept in sessionStorage so a refresh doesn't lose the demo.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { merchant, plan } from '../data';
import type { InvestOptionId } from '../data';

export type Investment = { amount: number; optionId: InvestOptionId; placedOn: string };

type State = {
  balance: number;
  investment: Investment | null;
  /** When the merchant first acted on the nudge (ms since epoch) */
  flowStartedAt: number | null;
  /** Seconds from nudge to order placed, for the last order */
  lastFlowSeconds: number | null;
};

type Actions = {
  startFlow: () => void;
  invest: (amount: number, optionId: InvestOptionId) => void;
  /** `principal` leaves the holding; `credited` (principal + earnings) lands in the account */
  withdraw: (principal: number, credited: number) => void;
  reset: () => void;
};

const KEY = 'kosh-demo';
const initial: State = { balance: merchant.balance, investment: null, flowStartedAt: null, lastFlowSeconds: null };

function load(): State {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch {
    return initial;
  }
}

const DemoContext = createContext<(State & Actions) | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(load);

  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage blocked: the demo still works in memory */
    }
  }, [state]);

  const startFlow = useCallback(
    () => setState((s) => (s.flowStartedAt ? s : { ...s, flowStartedAt: Date.now() })),
    [],
  );

  const invest = useCallback((amount: number, optionId: InvestOptionId) => {
    setState((s) => ({
      ...s,
      balance: s.balance - amount,
      investment: {
        amount: (s.investment?.amount ?? 0) + amount,
        optionId,
        placedOn: plan.today,
      },
      lastFlowSeconds: s.flowStartedAt ? Math.round((Date.now() - s.flowStartedAt) / 1000) : null,
      flowStartedAt: null,
    }));
  }, []);

  const withdraw = useCallback((principal: number, credited: number) => {
    setState((s) => {
      if (!s.investment) return s;
      const left = s.investment.amount - principal;
      return { ...s, balance: s.balance + credited, investment: left > 0 ? { ...s.investment, amount: left } : null };
    });
  }, []);

  const reset = useCallback(() => setState(initial), []);

  const value = useMemo(() => ({ ...state, startFlow, invest, withdraw, reset }), [state, startFlow, invest, withdraw, reset]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used inside DemoProvider');
  return ctx;
}
