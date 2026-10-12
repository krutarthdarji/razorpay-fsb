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
  /**
   * Who Kosh is for: a balance this far above upcoming payments, for at least this long.
   * Below it the reward is too small to change behaviour (₹5 lakh for 60 days earns about ₹5,400).
   */
  eligibility: { minSurplus: 5_00_000, minDays: 60 },
  /** Smallest amount, and the step for the slider and its + and − buttons */
  slider: { min: 10_000, step: 10_000 },
  /**
   * What an auto-sweep FD pays, by how long the money stays. Swept-in money earns the
   * bank's FD rate for the days it was actually held. These are ICICI Bank's rates for
   * deposits under ₹3 crore, effective 12 Oct 2026 (ICICI is a RazorpayX partner bank).
   * The landing page quotes one reference rate, `referencePct`: swept money moves in and
   * out, so it mostly earns the 1 to 2 month rates (4.25% to 4.5%), less the 0.5% charged
   * each time an FD is broken early. About 4% a year.
   * Inside the app, Kosh is compared only with idle cash, which earns nothing.
   */
  sweepFd: {
    source: 'ICICI Bank FD rates, 12 Oct 2026',
    /** The one rate the landing page quotes for a sweep FD */
    referencePct: 4,
    /** No interest if withdrawn within this many days */
    minDays: 7,
    slabs: [
      { upToDays: 29, pct: 3.5 },
      { upToDays: 45, pct: 4.25 },
      { upToDays: 60, pct: 4.5 },
      { upToDays: 90, pct: 4.75 },
      { upToDays: 184, pct: 5.25 },
      { upToDays: 364, pct: 5.5 },
      { upToDays: Infinity, pct: 6.25 },
    ],
    earlyBreakPenaltyPct: 0.5,
  },
};
