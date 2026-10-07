/** The demo's one recommendation, derived from mock data. Every screen reads numbers from here. */
import { bufferBasis, expectedInflows, investOptions, merchant, plan, recommendedOption, upcomingOutflows } from '../data';
import { addDays } from './dates';
import { compareEarnings, earnings, outflowPayments, projectedBalance, safeToInvest, weeklyFlows } from './forecast';

const amounts = safeToInvest(merchant.balance, upcomingOutflows, bufferBasis);
const scheduledPayments = outflowPayments(upcomingOutflows);
const bufferPayments = outflowPayments(bufferBasis);

export const recommendation = {
  ...amounts,
  days: plan.horizonDays,
  option: recommendedOption,
  /** When units are allotted for an order placed today */
  allotmentDate: addDays(plan.today, plan.allotmentDays),
  /** What the safe amount earns in the recommended option over the horizon */
  expectedEarnings: earnings(amounts.safe, recommendedOption.annualRatePct, plan.horizonDays),
  comparison: compareEarnings(
    amounts.safe,
    plan.horizonDays,
    recommendedOption.annualRatePct,
    investOptions.sweepFd.annualRatePct,
  ),
};

/** Next-45-days picture for the charts */
export const cashflow = {
  totalIn: expectedInflows.reduce((s, i) => s + i.amount, 0),
  totalOut: amounts.scheduled,
  weeks: weeklyFlows(expectedInflows, scheduledPayments, bufferPayments, plan.today, plan.horizonDays),
  balance: projectedBalance(
    merchant.balance,
    amounts.safe,
    expectedInflows,
    [...scheduledPayments, ...bufferPayments],
    plan.today,
    plan.horizonDays,
  ),
};
