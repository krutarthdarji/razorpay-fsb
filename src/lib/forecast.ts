/**
 * Mocked forecast. Pure functions, no side effects.
 *
 * The idea in one line:
 *   safe to invest = balance - known outflows (next 45 days) - safety buffer
 */
import type { Outflow } from '../data/types';

/** Simple interest: amount × annual rate × days ÷ 365, rounded to the rupee */
export function earnings(amount: number, annualRatePct: number, days: number): number {
  return Math.round((amount * (annualRatePct / 100) * days) / 365);
}

export function totalOutflows(outflows: Outflow[]): number {
  return outflows.reduce((sum, o) => sum + o.amount, 0);
}

export type SafeAmount = {
  /** Balance minus known outflows */
  surplus: number;
  /** Known outflows plus the safety buffer */
  keptAside: number;
  /** What we recommend investing. Never below zero. */
  safe: number;
};

export function safeToInvest(balance: number, outflows: Outflow[], buffer: number): SafeAmount {
  const out = totalOutflows(outflows);
  const keptAside = out + buffer;
  return {
    surplus: balance - out,
    keptAside,
    safe: Math.max(0, balance - keptAside),
  };
}

/** True when the chosen amount eats into the safety buffer */
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
