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
- Ravi, Anand Coaching Centre: ₹20L after term fees. Between terms, fees bring ₹7.5L a month and costs run ₹10.2L. ₹5L stays spare until next term fees.

## Today and the friction
- Leave it idle, hold an oversized buffer, sweep at a guessed limit, or invest by hand on another app. Every option is a trade-off.
- Frictions: Knowledge (what's spare?), Fear (what if payroll bounces?), Effort (another platform, paperwork), Liquidity (what if I need it tomorrow?).

## The solution
- Kosh, Razorpay's agentic AI, projects the real cash flow and recommends: "Invest ₹5,00,000 of your surplus for 6 months", in top-rated liquid and short-term debt funds. More returns, 100% liquid.
- Knowledge → the agent's answer. Fear → every payment is projected and a cushion for misc expenses is kept first. Effort → one tap. Liquidity → instant credit, free for a day.

## Landing page (`/`)
Responsive, razorpay.com/x look. Sections in order: Hero (live app preview), Problem, Merchant, Today (trade-offs and frictions), Insight, Solution, Flow, Why Razorpay and why mobile, Decisions, Metrics, Impact, closing CTA. App Demo button centred in the hero; docks at the bottom once it scrolls away; steps aside at the closing CTA.

## Live dates
- The app runs on the real date. Balance, what's paid or expected this month, the projection and Kosh's recommendation are all worked out from it. The order screen shows the real next working day for allotment.

## One cycle (the whole demo)
- Kosh makes one recommendation when the demo starts: ₹5,00,000 for 6 months. It is fixed. Kosh already looked across all 6 months to reach it (the lowest balance on the way, less its cushion), so nothing in between changes it: no new amount to add, no withdrawal to make.
- The demo ends when the 6 months do. Then Home, Kosh and Portfolio show **Cycle complete**: what the surplus earned, its growth graph, the same money in an auto-sweep FD and idle, and **Reset demo**. No more fast-forward or investing; withdrawing still works.

## Demo controls
- **Fast-forward to allotment** and **Fast-forward 1 month**, in a dashed "Demo controls" card on the order page, Home, Kosh and Portfolio. The card shows the months done (6 segments), the date the demo ends, and what the money has grown to.
- The buttons show only while the investment matches Kosh's recommendation. Under or over it, the card says: "Fast-forward is available when your investment matches Kosh's recommendation of ₹5,00,000." Topping up or withdrawing to match brings them back.
- Each fast-forward moves the account, not the recommendation: fees come in, payments go out, the investment grows. A summary sheet shows the month ("Month 3 of 6 done"), what the investment earned in that stretch and since investing, and the account's movements. The sixth one ends the cycle and opens the result on Home.

## App demo (`/app`, mobile only)
Own header inside the phone column (RazorpayX logo, Kosh, owner avatar). Bottom nav with three tabs, all part of the job: **Home, Kosh, Portfolio**.

### Flow (under 2 minutes)
Nudge → recommendation → one-tap invest (MPIN) → order placed with allotment date → portfolio. Customise is optional and never in the way.

### Home
- Balance hero.
- Three stat cards, each opens a detail screen: **Monthly revenue** (average coming in), **Estimated expenses** (average going out), **Projected liquid money** (the lowest balance Kosh projects, and its date).
- **Kosh's recommendation** card (same type scale as the Kosh page: title, message, then detail): "Invest ₹5,00,000 of your surplus for 6 months." More returns, 100% liquid, no lock-in. A bar splits today's balance into for your payments, Kosh's cushion, surplus to invest. "Why?" opens how Kosh arrived at it. CTA: **"Put my ₹5,00,000 to work"**.
- **What your surplus could earn** card (before investing): growth graph and bars for invested through Kosh vs auto-sweep FD vs idle in current account, with the extra rupees.
- **Your money is compounding** card (after investing): roughly what it has earned, earns a day, and a graph of the money across the 6 months (darker: so far; lighter: where it is heading). All figures approximate.
- After investing, the **Kosh's recommendation** card shows "You've invested" next to "Kosh recommends", with Kosh's suggestion when they differ: invest the gap, or you might need to withdraw the excess.
- **Liquidity** card: your liquidity stays 100% intact. You withdraw, Razorpay credits you instantly (1 day of free credit), the fund pays Razorpay next working day.

### Money coming in / Money going out (`/app/revenue`, `/app/expenses`)
- Kosh's one-line read at the top. Month-by-month bars: last 3 months tracked by Razorpay (solid), this month, then Kosh's projection (light), with a short note on months that stand out (winter break, crash courses, Diwali bonus, advance tax, term fees).
- This month: received or paid vs what Kosh expects, each row tagged with the Razorpay product that tracks it.

### Projected liquid money (`/app/liquidity`)
- Kosh's recommendation, then how it got there: 1. Kosh projects your balance (month bars and a chart, lowest point marked). 2. Kosh recommends a ₹1,50,000 cushion (what it covers). 3. The rest is surplus Kosh recommends investing. Then Kosh's recommendation for 3, 6, 9 and 12 months, and "How Kosh knows" (Razorpay tracks it → Cashflow Forecaster predicts 3 to 7 days → Kosh projects the year).

### Kosh (`/app/kosh`): follows where the merchant stands
- **Nothing invested:** "Kosh recommends" (title), "Invest ₹5,00,000 of your surplus for 6 months", then amount and duration sliders (1 to 12 months). Kosh's 50/50 split is pre-filled. Projected growth for the chosen period. CTA "Invest ₹X for N months".
- **Under Kosh's recommendation:** "₹X more of your surplus can grow", with what's invested and what Kosh recommends. Sliders stay on the top card, pre-set to the remaining amount.
- **Invested as Kosh recommends:** green card, "You're invested as Kosh recommends. Your idle cash is earning returns." No sliders, no pre-filled cart, no invest button. "Want to invest more?" opens an amount slider starting at ₹0 and an empty fund selection.
- **Over Kosh's recommendation:** "You might need to withdraw ₹X", naming the payments that may need it, with "Go to withdraw".
- The sliders are the merchant's to move freely. Nothing is judged or recalculated while they choose: no badges, no warnings, and the headline does not change. A "Back to Kosh's recommendation" link appears once they move off it. Kosh re-assesses after the order, and the page then shows where they stand.
- Below: projected growth (start value → approximate end value, curve, gains along the way; compounding), the liquidity promise, and the eight funds.
- Sliders have − and + buttons (₹10,000 steps; 1 month for duration). A flag above the track, "Kosh recommends ₹5L" or "6 months", points at the exact spot; it fills in with a tick when the slider is on it. The most that can be invested is what the account can spare for the next month after Kosh's cushion; the page says so at the limit.
- Arriving on the page, or completing any transaction, resets the sliders to Kosh's recommendation. Coming back from a fund's page keeps them.

### Fund detail (`/app/fund/:id`)
- Rating, category, exit load; return headline; NAV chart for 1M to 5Y; NAV, fund size, minimum; "not one down month in 5 years" (or its lowest month); return calculator and table; what the fund does.

### Order placed
- Success animation, amount, "Done in m:ss", "For N months · 100% liquid", and where the money went, fund by fund.
- Steps: order placed, money sent, units will be allotted (next working day). No "earning starts" line.

### Portfolio
- Approximate value today, invested, approximate earnings; holdings by fund with a split bar. Withdraw from all funds or from one fund (instant credit, free for a day), and Invest more.

### Account (tap the avatar)
- Merchant details and **Reset demo** (clears investments, starts again from the nudge).

### Never a dead end
- Unknown addresses under `/app` go Home. Back works on a screen opened directly (goes Home, or to Kosh from a fund). A damaged saved session starts clean. If a screen ever fails to draw, a "Restart demo" screen replaces the blank page.

## Decisions
| We chose | Because |
|---|---|
| An agent, not a calculator | Merchants want an answer, not a tool |
| One tap by default | Habit forms when effort is near zero |
| Recommend by safety and horizon, not top returns | Trust before yield |
| Free 1-day instant credit | Removes "what if I need it?" |
| Value in rupees vs sitting idle | That is how owners think |
| Only liquid and short-term debt funds | Working capital must stay safe and liquid |
| Kosh recommends amount, duration and split; all editable | The agent suggests; the owner decides |
| Real funds, real past returns | Trust needs real numbers |

| We left out | Because |
|---|---|
| Auto-invest | Trust first; automation once the habit forms |
| Open-ended fund search and research tools | Eight curated funds are enough; more recreates the effort we remove |
| Full dashboards | Focus beats breadth |

## Metrics
- North star: share of idle surplus put to work.
- Merchant value: extra ₹ earned vs idle and sweep FD.
- Habit: one-tap acceptance rate; repeat investing within 60 days.
- Guardrail: zero missed payments because of investing.
