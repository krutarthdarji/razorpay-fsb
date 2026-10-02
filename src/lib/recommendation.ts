/** The demo's one recommendation, derived from mock data. Every screen reads numbers from here. */
import { merchant, plan, recommendedOption, upcomingOutflows } from '../data';
import { earnings, safeToInvest } from './forecast';

const safeAmount = safeToInvest(merchant.balance, upcomingOutflows, plan.safetyBuffer);

export const recommendation = {
  ...safeAmount,
  days: plan.horizonDays,
  option: recommendedOption,
  /** What the safe amount earns in the recommended option over the horizon */
  expectedEarnings: earnings(safeAmount.safe, recommendedOption.annualRatePct, plan.horizonDays),
};
