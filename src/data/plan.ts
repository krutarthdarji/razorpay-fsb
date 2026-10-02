/** Inputs to the forecast that are product decisions, not merchant data */
export const plan = {
  /** How far ahead we look at outflows, and how long the money is invested */
  horizonDays: 45,
  /** Extra cash always kept in the account on top of known outflows */
  safetyBuffer: 3_00_000,
  slider: {
    min: 10_000,
    /** Full surplus (balance minus known outflows) */
    max: 8_00_000,
    step: 10_000,
  },
};
