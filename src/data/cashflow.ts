import type { CushionItem, MonthKey, Stream, YearlyItem } from './types';

/**
 * Anand Coaching Centre's cash pattern, by calendar month. Nothing here is tied to a
 * fixed "today": the app reads the real date and works everything out from it.
 *
 * Term fees land twice a year (April and September). In between, fees come in
 * monthly but costs run higher, so term-fee money carries the business. Over a
 * full year the two roughly balance, so the pattern repeats and Kosh always has
 * a sensible picture however far the demo clock is moved.
 * Months differ: winter break, board-exam crash courses, summer power bills,
 * Diwali bonus, advance tax.
 */

const L = 1_00_000;
/** Amounts in lakh for Jan to Dec, as a lookup by month key */
const byCalendarMonth = (janToDec: number[]) => (month: MonthKey) => Math.round(janToDec[Number(month.slice(5, 7)) - 1] * L);

/** Salaries and rent step up each April (yearly raise, lease renewal) */
const withAprilStep = (base: number, stepped: number) => (month: MonthKey) => Math.round((month >= '2027-04' ? stepped : base) * L);

/** Comes in every month */
export const revenueStreams: Stream[] = [
  {
    id: 'fees',
    label: 'Monthly fee instalments',
    dayOfMonth: 10,
    source: 'Razorpay Subscriptions',
    amount: byCalendarMonth([7.05, 6.9, 6.45, 6.8, 6.4, 6.6, 6.9, 6.75, 7.0, 6.5, 6.7, 6.3]),
  },
  {
    id: 'enrolments',
    label: 'New enrolments and crash courses',
    dayOfMonth: 20,
    source: 'Razorpay Payment Links',
    amount: byCalendarMonth([2.15, 1.45, 0.7, 1.6, 1.1, 0.9, 0.8, 0.9, 1.2, 1.0, 1.05, 1.55]),
  },
];

/** Goes out every month */
export const expenseStreams: Stream[] = [
  { id: 'salaries', label: 'Salaries', dayOfMonth: 1, source: 'RazorpayX Payroll', amount: withAprilStep(6.5, 6.9) },
  { id: 'rent', label: 'Rent', dayOfMonth: 5, source: 'RazorpayX Vendor Payments', amount: withAprilStep(1.5, 1.6) },
  {
    id: 'electricity',
    label: 'Electricity',
    dayOfMonth: 10,
    source: 'RazorpayX Payouts',
    amount: byCalendarMonth([0.3, 0.33, 0.42, 0.55, 0.62, 0.58, 0.5, 0.47, 0.44, 0.4, 0.34, 0.31]),
  },
  { id: 'internet', label: 'Internet and software', dayOfMonth: 12, source: 'RazorpayX Payouts', amount: withAprilStep(0.15, 0.16) },
  {
    id: 'maintenance',
    label: 'Maintenance and housekeeping',
    dayOfMonth: 15,
    source: 'RazorpayX Vendor Payments',
    amount: byCalendarMonth([0.3, 0.28, 0.32, 0.35, 0.3, 0.3, 0.32, 0.3, 0.3, 0.3, 0.28, 0.42]),
  },
  {
    id: 'material',
    label: 'Study material and printing',
    dayOfMonth: 18,
    source: 'RazorpayX Vendor Payments',
    amount: byCalendarMonth([1.05, 0.85, 0.5, 1.3, 0.8, 0.7, 0.75, 0.8, 1.2, 0.75, 0.7, 0.9]),
  },
  {
    id: 'gst',
    label: 'GST',
    dayOfMonth: 20,
    source: 'RazorpayX Tax Payments',
    amount: byCalendarMonth([0.66, 0.7, 0.64, 1.8, 0.68, 0.66, 0.7, 0.69, 1.7, 0.6, 0.62, 0.58]),
  },
];

/** Comes in once a year */
export const yearlyInflows: YearlyItem[] = [
  { id: 'term-fees-apr', label: 'Term fees, new academic year', month: 4, day: 1, amount: 21 * L, source: 'Razorpay Payment Gateway' },
  { id: 'term-fees-sep', label: 'Term fees, second term', month: 9, day: 1, amount: 21.5 * L, source: 'Razorpay Payment Gateway' },
  { id: 'late-term-fees', label: 'Late term-fee payments', month: 10, day: 2, amount: 1.2 * L, source: 'Razorpay Payment Gateway' },
];

/** Goes out once a year */
export const yearlyOutflows: YearlyItem[] = [
  { id: 'diwali-bonus', label: 'Diwali bonus', month: 11, day: 5, amount: 1.2 * L, source: 'RazorpayX Payroll' },
  { id: 'advance-tax-dec', label: 'Advance tax', month: 12, day: 15, amount: 0.9 * L, source: 'RazorpayX Tax Payments' },
  { id: 'software-renewal', label: 'Yearly software renewal', month: 1, day: 12, amount: 0.45 * L, source: 'RazorpayX Payouts' },
  { id: 'advance-tax-mar', label: 'Advance tax', month: 3, day: 15, amount: 0.9 * L, source: 'RazorpayX Tax Payments' },
  { id: 'advance-tax-jun', label: 'Advance tax', month: 6, day: 15, amount: 0.4 * L, source: 'RazorpayX Tax Payments' },
  { id: 'advance-tax-sep', label: 'Advance tax', month: 9, day: 15, amount: 1.0 * L, source: 'RazorpayX Tax Payments' },
];

/** Term fees are the big refills; the rest of the year runs on them */
export const termFeeIds = ['term-fees-apr', 'term-fees-sep'];

/**
 * One known point on the account. The balance on any other day follows from the
 * streams above, so the demo stays consistent whenever it is opened.
 */
export const balanceAnchor = { date: '2026-10-08', balance: 20 * L };

/** What Kosh's cushion covers: surprises from the last 12 months */
export const cushionBasis: CushionItem[] = [
  { id: 'repairs', label: 'Repairs and replacements', note: 'Projector, ACs, furniture', amount: 0.5 * L },
  { id: 'refunds', label: 'Fee refunds', note: 'Students who drop out mid-term', amount: 0.6 * L },
  { id: 'misc', label: 'Everything else', note: 'Events, travel, one-off bills', amount: 0.4 * L },
];

/** Why a calendar month stands out, in a few words (1 = January) */
export const revenueNotes: Record<number, string> = {
  12: 'Winter break, fewer instalments',
  1: 'Crash courses before board exams',
  3: 'Exam month, batches wind down',
  4: 'Term fees for the new year',
  9: 'Term fees for the second term',
};
export const expenseNotes: Record<number, string> = {
  11: 'Diwali bonus',
  12: 'Advance tax, test-series printing',
  1: 'Yearly software renewal',
  3: 'Advance tax',
  4: 'Salary raise, new-year books, GST on term fees',
  6: 'Advance tax',
  9: 'Advance tax, GST on term fees',
};
