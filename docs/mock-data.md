# Mock Data (illustrative persona) and real fund data

Merchant numbers are illustrative. Fund numbers are real. Source of truth is `src/data/`; maths in `src/lib/`.

## Merchant
- Anand Coaching Centre, owner Ravi Anand, RazorpayX current account.
- Dates are live. One anchor is fixed: balance ₹20,00,000 on 8 Oct 2026. The balance on any other day follows from the cash-flow pattern (₹26,10,000 on 11 Oct, after fee instalments on the 10th; ₹21,76,000 on 20 Nov). The tables below are as seen from 8 to 11 Oct 2026.
- Pattern: term fees land in April (₹21L) and September (₹21.5L). Between terms, monthly fees are lower than monthly costs. Over a full year the business makes a little more than it spends, so Kosh always has a surplus to recommend (₹5L to ₹8L across the next four years).

## Kosh's projection, month by month (in lakh)
| Month | In | Out | Closing | What stands out |
|---|---|---|---|---|
| Oct (rest) | 7.50 | 2.20 | 25.30 | Salaries and rent already paid |
| Nov | 7.75 | 11.29 | 21.76 | Diwali bonus ₹1.2L |
| Dec | 7.85 | 11.26 | 18.35 | Winter break; advance tax ₹0.9L |
| Jan | 9.20 | 10.91 | 16.64 | Crash courses before boards; software renewal |
| Feb | 8.35 | 10.31 | 14.68 | |
| Mar | 7.15 | 10.93 | 10.90 | Exam month; advance tax ₹0.9L |
| Apr | 29.40 | 12.66 | 27.64 | Term fees ₹21L; salary raise; GST on fees |
- Lowest point in 6 months: ₹6,68,000 on 5 Mar. Average month: about ₹8.1L in, ₹10.9L out.
- Streams and the Razorpay product that tracks each: fee instalments (Razorpay Subscriptions), enrolments (Payment Links), term fees (Payment Gateway), salaries and bonus (RazorpayX Payroll), rent, maintenance, study material (Vendor Payments), electricity, internet (Payouts), GST and advance tax (Tax Payments).

## Kosh's recommendation
- Kosh's cushion: ₹1,50,000 (repairs ₹50K, fee refunds ₹60K, everything else ₹40K)
- Headline: invest ₹5,00,000 of surplus for 6 months
- By duration: 1 month ₹14.5L · 2 months ₹12L · 3 months ₹8.5L · 4 months ₹7L · 5 to 12 months ₹5L
- Units allotted next day. Withdrawals credited instantly by Razorpay, 1 day of free credit.

## What ₹5,00,000 could earn in 6 months
| Where | Earns |
|---|---|
| Through Kosh (50% ABSL Liquid, 50% Tata Money Market, compounding at their last-12-month pace of 6.69%) | ₹16,419 |
| Auto-sweep FD at 3.25% a year (HDFC Bank's 30 to 45 day FD rate, Sep 2026) | ₹8,103 |
| Idle in current account | ₹0 |
- ₹8,316 more than an auto-sweep FD. Earns about ₹89 a day.

## Funds (real)
NAV history is real AMFI data via api.mfapi.in, snapshot 9 Oct 2026 in `src/data/funds.generated.json` (`node scripts/fetch-funds.mjs` refreshes it; scheme codes from AMFI's master list). Ratings are Groww's, with fund size, minimum and exit load as published on 9 Oct 2026. All Direct Plan, Growth.

| Fund | Kind | Rating | Size (₹ Cr) | 1Y | Lowest month in 5 years |
|---|---|---|---|---|---|
| Aditya Birla Sun Life Liquid Fund | Liquid | 5★ | 61,167 | +6.6% | +0.27% |
| Axis Liquid Fund | Liquid | 5★ | 53,470 | +6.6% | +0.27% |
| Edelweiss Liquid Fund | Liquid | 5★ | 11,741 | +6.6% | +0.22% |
| Nippon India Liquid Fund | Liquid | 4★ | 43,125 | +6.7% | +0.23% |
| Tata Money Market Fund | Money market | 5★ | 31,690 | +6.8% | −0.01% |
| Tata Ultra Short Term Fund | Ultra short duration | 5★ | 5,404 | +7.0% | +0.06% |
| ICICI Prudential Short Term Fund | Short duration | 5★ | 18,890 | +5.6% | −0.41% |
| Axis Short Duration Fund | Short duration | 5★ | 7,425 | +5.4% | −0.83% |
- Exit load: the four short-term debt funds have none. Every liquid fund in India has a regulator-set load of under 0.01% for the first 6 days, none after.
- Kosh's default split picks the largest 5★ fund in each group: ABSL Liquid and Tata Money Market. Neither lost money over any 3-month stretch in 5 years.

## Razorpay features referenced (real, checked Oct 2026)
- RazorpayX Cashflow Insights: total inflow and payouts over the past 7, 15, 30 or 90 days; the June 2026 agent adds balances, incoming payments and how long funds will last.
- Cashflow Forecaster (Razorpay Agent Studio, March 2026): predicts cash position 3 to 7 days ahead with alerts.
- Kosh's 12-month projection and investing are this prototype's proposal, not an existing Razorpay feature.
