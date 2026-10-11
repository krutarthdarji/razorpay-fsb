export type Merchant = {
  businessName: string;
  ownerName: string;
  ownerFirstName: string;
  accountName: string;
  /** How many days the surplus has been sitting idle */
  idleDays: number;
};

/** "2026-11" */
export type MonthKey = string;

/**
 * Money that moves around the same day each month, but not the same amount.
 * Kosh projects each month from the account's history: `amount(month)`.
 */
export type Stream = {
  id: string;
  label: string;
  dayOfMonth: number;
  /** The Razorpay product that tracks this money today */
  source: string;
  amount: (month: MonthKey) => number;
};

/** Money that moves once a year, on the same date */
export type YearlyItem = {
  id: string;
  label: string;
  /** 1 to 12 */
  month: number;
  day: number;
  amount: number;
  source: string;
};

/** Sized by Kosh from the last 12 months */
export type CushionItem = { id: string; label: string; note: string; amount: number };
