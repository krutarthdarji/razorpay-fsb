import { todayIso } from '../lib/dates';

/** Inputs to the forecast that are product decisions, not merchant data */
export const plan = {
  /**
   * The date the app treats as today. Starts as the real date; the demo's fast-forward
   * moves it (always through `setToday` in lib/recommendation).
   */
  today: todayIso(),
  /** The duration Kosh recommends by default */
  recommendMonths: 6,
  /** Shortest and longest the merchant can choose */
  minMonths: 1,
  maxMonths: 12,
  /** Recommendations are rounded down to this, to keep them simple */
  roundTo: 50_000,
  /** Razorpay credits withdrawals instantly; the credit is free for this many days */
  freeCreditDays: 1,
  /** Smallest amount, and the step for the slider and its + and − buttons */
  slider: { min: 10_000, step: 10_000 },
  /**
   * What an auto-sweep FD pays on short deposits. HDFC Bank's 30 to 45 day FD rate
   * was 3.25% a year in Sep 2026; sweep-in FDs earn the same rate as the matching FD.
   */
  sweepFdPct: 3.25,
};
