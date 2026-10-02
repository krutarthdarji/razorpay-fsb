import type { Outflow } from './types';

/** Payments already scheduled for the next 45 days: on the merchant's calendar */
export const upcomingOutflows: Outflow[] = [
  {
    id: 'salaries',
    label: 'Salaries',
    amount: 6_50_000,
    payments: [{ date: '2026-11-01', amount: 6_50_000 }],
  },
  {
    id: 'rent',
    label: 'Rent',
    amount: 1_50_000,
    payments: [{ date: '2026-11-05', amount: 1_50_000 }],
  },
  {
    id: 'gst',
    label: 'GST',
    amount: 2_50_000,
    payments: [{ date: '2026-11-20', amount: 2_50_000 }],
  },
  {
    id: 'vendors',
    label: 'Vendors',
    amount: 1_50_000,
    payments: [
      { date: '2026-10-15', amount: 75_000 },
      { date: '2026-11-12', amount: 75_000 },
    ],
  },
];
