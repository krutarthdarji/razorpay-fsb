import type { Outflow } from './types';

/**
 * The safety buffer, sized by Kosh from the merchant's own account history:
 * spends that are not scheduled yet but happen every year. Not a rule of thumb.
 */
export const bufferBasis: Outflow[] = [
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
