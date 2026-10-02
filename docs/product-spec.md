# Product Spec

## The job
- Merchant: SME owner on a RazorpayX current account. Runs the business from the phone.
- Job: "Never miss a payment, and don't let the rest sit wasted."
- Root cause we solve: they can't see how much of their cash is actually spare.

## Core flow (demo path, under 2 minutes)
Home → Insight → Option → Invest → Success
Then: Portfolio → Redeem

## Screens

### 1. Home
- RazorpayX-style home: account balance at top.
- One nudge card (the hero of the screen):
  - "₹5,00,000 can earn for you"
  - "Idle for 12 days. Could earn about ₹3,945 in 45 days."
  - CTA: "See safe amount"
- Bottom nav: Home, Payouts, Invest, More. Only Home and Invest are functional. Others show a "Not part of this demo" toast.

### 2. Insight
- Headline: "₹5,00,000 is safe to invest for about 45 days"
- Sub: "Based on your inflows, outflows and upcoming payouts."
- "Why this amount" (Collapsible, closed by default). Three lines:
  - Balance today: ₹20,00,000
  - Kept aside for salaries, rent, GST and vendors (next 45 days) plus a buffer: ₹15,00,000
  - Safe to invest: ₹5,00,000
  - Small list of upcoming outflows with dates (from mock data)
- CTA: "Invest ₹5,00,000"

### 3. Option
- Recommended option card (pre-selected): Liquid Fund. "Earns about ₹3,945 in 45 days."
- One alternative: Overnight Fund. "Lowest risk. Earns about ₹3,575 in 45 days."
- Comparison strip for the selected option: This option ₹3,945 vs Sweep FD ₹2,003 vs Idle ₹0
- "Details" tap (BottomSheet): expected return, risk level, withdrawal time. Keep it short.
- Reassurance line: "Low-risk funds. Withdraw anytime with Instant Redeem."
- Recommended amount always visible at top: "Recommended: ₹5,00,000"

### 4. Invest
- Amount slider (custom AmountSlider). Range ₹10,000 to ₹8,00,000. Starts at ₹5,00,000.
- Recommended marker on the slider.
- Live earnings preview updates with the amount.
- Above ₹5,00,000: soft warning (Alert, notice): "Above the safe amount. Your buffer for salaries on 1 Nov gets thinner." Not blocked.
- Debit from: RazorpayX current account (shown, not editable)
- CTA: "Invest ₹X" opens MPIN (OTPInput, 4 digits, any value works in demo)

### 5. Success
- Short success animation.
- "₹5,00,000 invested in Liquid Fund"
- "Units by tomorrow. Withdraw anytime."
- CTA: "View portfolio"

### 6. Portfolio (Invest tab)
- Current value, invested amount, earned so far.
- Hero line: "₹1,294 more than sweep FD"
- Holding card: fund, amount, earned.
- Buttons: "Invest more" (goes to Insight with fresh recommendation), "Redeem"

### 7. Redeem
- Amount input (default full value).
- "Instant Redeem: money in your account now."
- Confirm with MPIN. Success toast. Balance updates on Home.

## Decisions (for the product note)
- Forecast-driven recommended amount. One number, not a breakdown screen.
- "Why this amount" collapsed by default.
- Merchant controls the final amount via slider. Soft warning, no block.
- Recommend by time horizon, not by highest return.
- Compare with sweep FD and idle cash, in rupees.
- Instant Redeem promised. Credit flow not built.

## Not built (on purpose)
- Auto-invest, auto-redeem, confidence scores, onboarding or KYC, fund search, equity products, credit flow, full portfolio analytics, transactions dashboard.

## Metrics (for the product note)
- North star: extra ₹ earned vs sweep FD
- Nudge-to-invest conversion, % eligible who invest once
- % of recommended amount accepted (final slider amount ÷ recommended)
- Repeat invest within 60 days
- Median time to invest under 2 minutes
- Guardrail: zero payouts failed due to an investment
