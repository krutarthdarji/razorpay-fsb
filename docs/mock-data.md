# Mock Data (illustrative persona)

All numbers are illustrative. Keep them consistent across screens.

## Merchant
- Business: Anand Coaching Centre (illustrative)
- Owner: Ravi Anand
- Account: RazorpayX current account
- Pattern: term fees come in during admission months. Salaries and rent go out every month. Cash piles up for weeks.

## Today
- Demo date: 8 Oct 2026 (`plan.today` in `src/data/plan.ts`)
- Balance: ₹20,00,000
- Idle surplus for: 12 days

## Scheduled payments (next 45 days)
| Item | Date | Amount |
|---|---|---|
| Salaries | 1 Nov | ₹6,50,000 |
| Rent | 5 Nov | ₹1,50,000 |
| GST | 20 Nov | ₹2,50,000 |
| Vendors | Various (15 Oct ₹75,000, 12 Nov ₹75,000) | ₹1,50,000 |
| Total | | ₹12,00,000 |

## Spends RazorpayX predicts (next 45 days)
Not on any calendar. Learned from the merchant's own account history. This is the personalised part of the recommendation.
| Item | Based on | Date | Amount |
|---|---|---|---|
| Fee refunds | Every year after admissions close | 18 Oct | ₹80,000 |
| Ads for the next batch | Ads 3 weeks before each batch | 25 Oct | ₹1,00,000 |
| Day-to-day spends | Usual supplies, utilities, travel | 15 Oct, 29 Oct, 12 Nov (₹40,000 each) | ₹1,20,000 |
| Total | | | ₹3,00,000 |

## Expected inflows (next 45 days)
Late term-fee instalments. Shown on Home, **not counted** in the safe amount: we only invest money already in the account.
| Date | Amount |
|---|---|
| 20 Oct | ₹90,000 |
| 3 Nov | ₹90,000 |
| 17 Nov | ₹60,000 |
| Total | ₹2,40,000 |

## Projected balance after investing ₹5,00,000
- Includes scheduled payments, predicted spends and expected fees
- ₹15,00,000 today, lowest ₹2,40,000 on 20 Nov. Every payment covered.
- If nothing is invested: ends at ₹7,40,000 (₹5,00,000 more sitting idle)

## Recommendation
- Balance minus scheduled payments: ₹20,00,000 − ₹12,00,000 = ₹8,00,000
- Spends RazorpayX predicts: ₹3,00,000
- Needed for the next 45 days: ₹15,00,000
- Recommended to invest: ₹5,00,000 for about 45 days
- Slider range: ₹10,000 to ₹8,00,000. Warning above ₹5,00,000

## Options (returns illustrative, pre-tax)
| Option | Approx return | Earns on ₹5L in 45 days |
|---|---|---|
| Liquid Fund (recommended) | ~6.4% a year | ~₹3,945 |
| Overnight Fund | ~5.8% a year | ~₹3,575 |
| Sweep FD (benchmark) | ~3.25% a year | ~₹2,003 |
| Idle in current account | 0% | ₹0 |
- Formula: amount × annual rate × days ÷ 365

## Portfolio state (after 30 days)
- Invested: ₹5,00,000
- Current value: ₹5,02,630
- Earned: ₹2,630
- Sweep FD would have earned: ₹1,336
- More than sweep FD: ₹1,294
