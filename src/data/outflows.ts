import type { Outflow } from './types';

/** Known payments going out in the next 45 days */
export const upcomingOutflows: Outflow[] = [
  { id: 'salaries', label: 'Salaries', date: '1 Nov', amount: 6_50_000 },
  { id: 'rent', label: 'Rent', date: '5 Nov', amount: 1_50_000 },
  { id: 'gst', label: 'GST', date: '20 Nov', amount: 2_50_000 },
  { id: 'vendors', label: 'Vendors', date: 'Various', amount: 1_50_000 },
];
