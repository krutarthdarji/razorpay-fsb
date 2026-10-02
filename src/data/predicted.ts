import type { Outflow } from './types';

/**
 * Spends not scheduled yet, that RazorpayX predicts from the merchant's own
 * account history. This is the personalised part of the recommendation.
 */
export const predictedSpends: Outflow[] = [
  {
    id: 'refunds',
    label: 'Fee refunds',
    basis: 'Every year after admissions close',
    amount: 80_000,
    payments: [{ date: '2026-10-18', amount: 80_000 }],
  },
  {
    id: 'ads',
    label: 'Ads for the next batch',
    basis: 'You spent on ads 3 weeks before each batch',
    amount: 1_00_000,
    payments: [{ date: '2026-10-25', amount: 1_00_000 }],
  },
  {
    id: 'day-to-day',
    label: 'Day-to-day spends',
    basis: 'Your usual spend on supplies, utilities and travel',
    amount: 1_20_000,
    payments: [
      { date: '2026-10-15', amount: 40_000 },
      { date: '2026-10-29', amount: 40_000 },
      { date: '2026-11-12', amount: 40_000 },
    ],
  },
];
