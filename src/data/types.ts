export type Merchant = {
  businessName: string;
  ownerName: string;
  ownerFirstName: string;
  accountName: string;
  /** Current account balance today, in rupees */
  balance: number;
  /** How many days the surplus has been sitting idle */
  idleDays: number;
};

/** A dated movement of money. Dates are ISO strings, e.g. "2026-11-01". */
export type CashEvent = {
  date: string;
  amount: number;
};

export type Outflow = {
  id: string;
  label: string;
  /** For predicted spends: what the prediction is based on, in plain words */
  basis?: string;
  /** Total over the horizon */
  amount: number;
  /** When it goes out. More than one payment shows as "Various". */
  payments: CashEvent[];
};

/** Money expected to come in. Shown to the merchant, but not counted in the safe amount. */
export type Inflow = {
  id: string;
  label: string;
} & CashEvent;

export type InvestOptionId = 'liquid' | 'overnight' | 'sweepFd' | 'idle';

export type InvestOption = {
  id: InvestOptionId;
  name: string;
  /** Approx annual return, pre-tax, in percent (6.4 means 6.4% a year) */
  annualRatePct: number;
  /** A fund the merchant can actually invest in (not a benchmark) */
  isInvestable: boolean;
  isRecommended: boolean;
  /** One plain line on why you'd pick it */
  note?: string;
};

export type Holding = {
  optionId: InvestOptionId;
  invested: number;
  daysHeld: number;
};
