import type { InvestOption, InvestOptionId } from './types';

/** Returns are illustrative and pre-tax */
export const investOptions: Record<InvestOptionId, InvestOption> = {
  liquid: {
    id: 'liquid',
    name: 'Liquid Fund',
    annualRatePct: 6.4,
    isInvestable: true,
    isRecommended: true,
  },
  overnight: {
    id: 'overnight',
    name: 'Overnight Fund',
    annualRatePct: 5.8,
    isInvestable: true,
    isRecommended: false,
  },
  sweepFd: {
    id: 'sweepFd',
    name: 'Sweep FD',
    annualRatePct: 3.25,
    isInvestable: false,
    isRecommended: false,
  },
  idle: {
    id: 'idle',
    name: 'Idle in current account',
    annualRatePct: 0,
    isInvestable: false,
    isRecommended: false,
  },
};

export const recommendedOption = investOptions.liquid;
