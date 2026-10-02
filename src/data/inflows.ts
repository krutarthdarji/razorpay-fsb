import type { Inflow } from './types';

/**
 * Late term-fee instalments expected in the next 45 days.
 * Not counted in the safe amount: we only invest money already in the account.
 */
export const expectedInflows: Inflow[] = [
  { id: 'fees-oct', label: 'Fee instalments', date: '2026-10-20', amount: 90_000 },
  { id: 'fees-nov-1', label: 'Fee instalments', date: '2026-11-03', amount: 90_000 },
  { id: 'fees-nov-2', label: 'Fee instalments', date: '2026-11-17', amount: 60_000 },
];
