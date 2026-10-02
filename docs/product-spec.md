# Product Spec

## Our USP
- RazorpayX **recommends the amount** to invest, personalised to the merchant. Anyone can subtract scheduled payments from a balance. Only RazorpayX can also predict the spends that are not on any calendar yet, from the merchant's own account history.
- No "safety buffer" anywhere in the product or copy. The gap between "balance minus scheduled payments" and the recommendation is explained as spends RazorpayX predicts.

## The job
- Merchant: SME owner on a RazorpayX current account. Runs the business from the phone.
- Job: "Never miss a payment, and don't let the rest sit wasted."
- Root cause we solve: they can't see how much of their cash is actually spare.

## Core flow (demo path, under 2 minutes)
Home → Insight → Option → Invest → Success
Then: Portfolio → Redeem

## Landing page (`/`)
- For someone arriving cold. Explains the problem, the idea, how it works, returns and guardrails, in the razorpay.com/x look.
- Sections: Hero (USP headline, live app preview), The problem (merchant + each friction point beside how we fix it), Our edge (Balance − Scheduled payments − Spends we predict = Recommended to invest, plus what we predict and what we learn from), How it works (4 stacking cards), Returns (rupees vs sweep FD and idle), Why on your phone, closing CTA.
- "App Demo" button: centred in the hero; once it scrolls away it docks at the bottom of the screen; it steps aside when the closing CTA is on screen. Opens `/app`.

## Screens (app demo, under `/app`)

### 1. Home
- RazorpayX-style home: account balance at top.
- Balance card also shows money coming in and going out over the next 45 days.
- One nudge card (the hero of the screen), badged "RazorpayX recommends". Also shows where the balance goes (half-donut: scheduled, predicted spends, recommended) and what the recommended amount earns vs sweep FD vs idle.
- "Next 45 days" card: weekly money in vs scheduled out vs predicted out (bar chart), the list of scheduled payments, and the spends RazorpayX predicts with what each is based on.
- "Your balance after investing" card: day-by-day balance (area chart), invested vs left idle. Every payment covered; shows the lowest balance and its date.
- Nudge card copy:
  - "₹5,00,000 can earn for you"
  - "Idle for 12 days. Could earn about ₹3,945 in 45 days."
  - CTA: "See safe amount"
- Bottom nav: Home, Payouts, Invest, More. Only Home and Invest are functional. Others show a "Not part of this demo" toast.

### 2. Insight
- Headline: "₹5,00,000 is safe to invest for about 45 days"
- Sub: "Based on your inflows, outflows and upcoming payouts."
- "Why this amount" (Collapsible, closed by default). Three lines:
  - Balance today: ₹20,00,000
  - Scheduled payments (salaries, rent, GST, vendors, next 45 days): ₹12,00,000
  - Spends RazorpayX predicts (not on your calendar yet): ₹3,00,000
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
- Above ₹5,00,000: soft warning (Alert, notice): "Above the recommended amount. Money for spends we expect gets thinner before salaries on 1 Nov." Not blocked.
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
