/** Inputs to the forecast that are product decisions, not merchant data */
export const plan = {
  /** The demo's "today". Change here to move every date in the app. */
  today: '2026-10-08',
  /** How far ahead we look at outflows, and how long the money is invested */
  horizonDays: 45,
  slider: {
    min: 10_000,
    /** Balance minus scheduled payments */
    max: 8_00_000,
    step: 10_000,
  },
};
