# Product Spec: RazorpayX Kosh

## Name
- **Kosh** (कोष, "treasury"). Shown as **RazorpayX Kosh**, a treasury agent. Large companies have treasury teams that never let cash sit idle; Kosh gives every SME owner one. Set in `src/brand.ts`.
- Part of Razorpay's agentic family, alongside Agent Studio's Cashflow Forecaster and RazorpayX agentic banking.

## The problem
- The money exists: about ₹25 lakh crore idle in current accounts.
- The intent exists: owners hate idle money.
- The behaviour doesn't: 86M+ MSMEs, about 1.4M institutional fund folios.
- Insight: merchants don't under-invest because they don't want returns. They under-invest because they can't see what's safe.

## The merchant
- A smart SME owner who runs the business from the phone. Defined by a cash pattern, not an industry: money regularly sitting above what the next month needs.
- Job: "Never miss a payment, and don't let the rest sit wasted."
- Ravi, Anand Coaching Centre: ₹20L after term fees, owes ₹12L over 45 days, ₹8L idle.

## Today and the friction
- Leave it idle, hold an oversized buffer, sweep at a guessed limit, or invest by hand on another app. Every option is a trade-off.
- Frictions: Knowledge (what's spare?), Fear (what if payroll bounces?), Effort (another platform, paperwork), Liquidity (what if I need it tomorrow?).

## The solution
- Kosh reads the real cash flow and says: "₹5,00,000 is safe to invest for 45 days. Recommended: ABC Liquid Fund."
- Knowledge → the agent's answer. Fear → payroll and a safety buffer Kosh sizes from history are kept aside first. Effort → one tap. Liquidity → instant credit, free for a day.

## Landing page (`/`)
Responsive, razorpay.com/x look. Sections in order: Hero (live app preview), Problem, Merchant, Today (trade-offs and frictions), Insight, Solution, Flow, Why Razorpay and why mobile, Decisions, Metrics, Impact, closing CTA. App Demo button centred in the hero; docks at the bottom once it scrolls away; steps aside at the closing CTA.

## App demo (`/app`, mobile only)
Own header inside the phone column (RazorpayX logo, Kosh, owner avatar). Bottom nav with three tabs, all part of the job: **Home, Kosh, Portfolio**.

### Flow (under 2 minutes)
Nudge → recommendation → one-tap invest (MPIN) → order placed with allotment date → portfolio. Customise is optional and never in the way.

### Home
- Balance hero; chip states "₹8,00,000 idle for 12 days" (or what's earning after investing).
- Kosh nudge (typing beat, then): "₹5,00,000 is safe to invest for 45 days." Earnings vs sweep FD in rupees. CTA "See recommendation".
- Upcoming payments, each marked Covered.
- Next 45 days: money in vs out (bar chart).

### Kosh (recommendation)
- Amount, recommended fund (picked for safety and horizon, not top returns), earnings vs sweep FD vs idle.
- "Why ₹5,00,000 is safe" (collapsed): balance − payments due − safety buffer = safe; how Kosh sized the buffer; balance-over-45-days chart.
- Sticky actions: **Invest ₹5,00,000** (one tap, then MPIN) and **Customise** (sheet: AmountSlider ₹10K–₹8L with Kosh marker, soft warning above ₹5L, fund choice).

### Order placed
- Success animation, amount and fund, **"Done in m:ss"** (real time since the nudge).
- Steps: order placed, money sent, units allotted tomorrow, earning starts.
- Instant credit reminder. CTA View portfolio.

### Portfolio
- Today / After 30 days views. Value, invested, earned; "₹1,294 more than your sweep FD" after 30 days; earnings vs sweep FD vs idle.
- Withdraw: amount sheet with "Instant credit, free for a day", then MPIN; toast; balance updates on Home.

## Decisions
| We chose | Because |
|---|---|
| An agent, not a calculator | Merchants want an answer, not a tool |
| One tap by default | Habit forms when effort is near zero |
| Recommend by safety and horizon, not top returns | Trust before yield |
| Free 1-day instant credit | Removes "what if I need it?" |
| Value in rupees vs idle and sweep FD | That is how owners think |

| We left out | Because |
|---|---|
| Auto-invest | Trust first; automation once the habit forms |
| Fund research tools | Recreates the effort we remove |
| Equity and long-term products | Working capital, not wealth |
| Full dashboards | Focus beats breadth |

## Metrics
- North star: share of idle surplus put to work.
- Merchant value: extra ₹ earned vs idle and sweep FD.
- Habit: one-tap acceptance rate; repeat investing within 60 days.
- Guardrail: zero missed payments because of investing.
