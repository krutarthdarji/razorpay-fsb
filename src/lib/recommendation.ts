/** The demo's one recommendation, derived from mock data. Every screen reads numbers from here. */
import {
  expectedInflows,
  investOptions,
  merchant,
  plan,
  predictedSpends,
  recommendedOption,
  upcomingOutflows,
} from '../data';
import { compareEarnings, earnings, outflowPayments, projectedBalance, safeToInvest, weeklyFlows } from './forecast';

const amounts = safeToInvest(merchant.balance, upcomingOutflows, predictedSpends);
const scheduledPayments = outflowPayments(upcomingOutflows);
const predictedPayments = outflowPayments(predictedSpends);

export const recommendation = {
  ...amounts,
  days: plan.horizonDays,
  option: recommendedOption,
  /** What the recommended amount earns in the recommended option over the horizon */
  expectedEarnings: earnings(amounts.safe, recommendedOption.annualRatePct, plan.horizonDays),
  comparison: compareEarnings(
    amounts.safe,
    plan.horizonDays,
    recommendedOption.annualRatePct,
    investOptions.sweepFd.annualRatePct,
  ),
};

/** Next-45-days picture for the Home charts */
export const cashflow = {
  totalIn: expectedInflows.reduce((s, i) => s + i.amount, 0),
  totalOut: amounts.keptAside,
  weeks: weeklyFlows(expectedInflows, scheduledPayments, predictedPayments, plan.today, plan.horizonDays),
  balance: projectedBalance(
    merchant.balance,
    amounts.safe,
    expectedInflows,
    [...scheduledPayments, ...predictedPayments],
    plan.today,
    plan.horizonDays,
  ),
};
