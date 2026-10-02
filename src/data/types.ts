export type Merchant = {
  businessName: string;
  ownerName: string;
  accountName: string;
  /** Current account balance today, in rupees */
  balance: number;
  /** How many days the surplus has been sitting idle */
  idleDays: number;
};

export type Outflow = {
  id: string;
  label: string;
  /** Display date, e.g. "1 Nov". "Various" when spread across the period. */
  date: string;
  amount: number;
};

export type InvestOptionId = 'liquid' | 'overnight' | 'sweepFd' | 'idle';

export type InvestOption = {
  id: InvestOptionId;
  name: string;
  /** Approx annual return, pre-tax, in percent (6.4 means 6.4% a year) */
  annualRatePct: number;
  /** A fund the merchant can actually invest in (not a benchmark) */
  isInvestable: boolean;
  isRecommended: boolean;
};

export type Holding = {
  optionId: InvestOptionId;
  invested: number;
  daysHeld: number;
};
