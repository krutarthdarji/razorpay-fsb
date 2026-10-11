/**
 * Text formatters for places Blade Amount can't go: chart axes, chart tooltips,
 * and rupees inside running sentences. Standalone figures always use <Amount />.
 */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** ₹5,00,000 */
export const formatINR = (value: number) => inr.format(value);

/** Short axis labels in lakhs: ₹15L, ₹7.5L, ₹90K */
export function formatLakh(value: number): string {
  if (Math.abs(value) >= 1_00_000) return `₹${+(value / 1_00_000).toFixed(1)}L`;
  if (Math.abs(value) >= 1_000) return `₹${Math.round(value / 1_000)}K`;
  return `₹${value}`;
}

/** 3.2% or −0.4%, one decimal, with a proper minus sign */
export const formatPct = (fraction: number) => `${fraction < 0 ? '−' : fraction > 0 ? '+' : ''}${Math.abs(fraction * 100).toFixed(1)}%`;

/** ~₹16,419: for estimates. Anything that depends on future returns is approximate, and says so. */
export const formatApprox = (value: number) => `~${formatINR(value)}`;
