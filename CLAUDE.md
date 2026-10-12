# RazorpayX Kosh (Buildathon prototype)

## What this is
- Entry for the Razorpay Buildathon, track "Razorpay in Your Pocket" (mobile). Brief: `Razorpay - FSB.docx` (git-ignored). Re-check every build against it: problem, merchant, today's friction, why mobile, a flow under 2 minutes, decisions and what was left out, metrics.
- **RazorpayX Kosh**: a proposed treasury agent for RazorpayX. It finds spare cash, recommends how much to invest and for how long, and prepares the order in safe, liquid funds. The owner approves every time. Name lives in `src/brand.ts`.
- Describe Kosh only as what it is. It is one agent (it would sit in RazorpayX Agentic Banking, beside the Payout Agent and Cashflow Insights), not "Razorpay's agentic AI". It never moves money on its own, it is not a chat assistant, and in this prototype its projection is a simulation on sample data.
- Read `docs/product-spec.md` before building any screen. Read `docs/design-system.md` before writing any UI. Use `docs/mock-data.md` for every number shown.

## Hard rules
- Two parts. The landing page (`/`) is a responsive pitch page in the razorpay.com/x style, with its own nav. The app demo (`/app/*`) is mobile only, including its header.
- App demo: design for 360 to 440 px wide. On laptops, show the same mobile layout in a centred, full-height column, max 480 px wide (like urbanofashion.com). No phone bezel, no desktop layouts.
- Every visible control belongs to the demo. No dead tabs, no "not part of this demo" messages. Tabs: Home, Kosh, Portfolio. Tap the avatar for Reset demo.
- One cycle. Kosh makes one recommendation on the day the demo starts: an amount for 6 months (`cycle` in `src/lib/recommendation.ts`; ₹5,00,000 for any start date up to Feb 2027). It is fixed for the whole demo: moving the clock never changes it, and nothing is re-recommended in between. The demo ends when the 6 months do. Never hard-code the amount; read `cycle.amount`.
- Safe assets only: liquid funds and short-term debt funds. No equity, ever. No risk-appetite choice, no risk labels.
- Liquidity promise: withdrawals are credited instantly by Razorpay, with 1 day of free credit until the fund pays out.
- One job: find what's safe and invest it. Do not build: auto-invest, auto-redeem, confidence scores, onboarding or KYC, regulatory screens, open-ended fund search (the list is a curated eight), a credit application flow, a full transactions dashboard. (Instant credit on withdrawal is a promise in the withdraw flow, not a credit product.)
- The core flow (nudge to order placed) must be completable in under 2 minutes. The order screen shows the real time taken.
- Frontend only. No backend. All data comes from `src/data/`. The forecast is a mocked function. Demo state lives in `src/state/demo.tsx`.
- Dates are live. `plan.today` starts as the real date; the balance, paid/expected statuses, projections and Kosh's recommendation are all derived from it (`src/lib/recommendation.ts`). Cash-flow data is defined by calendar month, never by a fixed year or "today". Do not hard-code dates or balances in screens.
- Demo clock: the fast-forward buttons (`TimeMachine`) move `plan.today` through `setToday()`, one month of the cycle at a time, and never past `cycle.until`. They show only while the investment matches Kosh's recommendation (`standing().status === 'at'`); otherwise the card says when they come back. Only `src/state/demo.tsx` moves the clock. The balance is never stored: it is `balanceOn(today) − invested + gains withdrawn`. On Kosh's path no payment needs the invested money, so the demo never withdraws on the merchant's behalf.
- End of the demo: when the cycle is over (`finished`), Home, Kosh and Portfolio show `CycleComplete` (what the surplus grew to, against idle cash, and Reset demo). No fast-forward and no new investing after that; withdrawing still works.
- Limits: the most that can be invested is `maxInvestable()` (what the account can spare for the next month after the cushion). Sliders, + and − buttons (step ₹10,000) and the order all respect it.
- Sliders are plain inputs. While the merchant is choosing an amount or duration, nothing about Kosh's assessment changes: no live badges, no warnings, no state flips. `standing()` reads only what is invested and the invested period, never the sliders. Kosh re-assesses after a transaction.
- The demo must never show a blank or broken screen. Saved state is checked in `load()` and dropped if unsound; unknown paths redirect; Back uses `useGoBack` (falls back when a screen was opened directly); `ErrorBoundary` offers a restart if anything else fails.

## Stack
- Vite + React 18 + TypeScript
- `@razorpay/blade` (Razorpay's own design system, MIT) with `styled-components@5`, `framer-motion@11`, `@razorpay/i18nify-js`, `@razorpay/i18nify-react`
- `react-router-dom@6` for screens
- Install with `npm i --legacy-peer-deps` (Blade lists React Native peers we don't use)
- Stay on React 18. Blade uses styled-components v5.

## Design rules
- Use Blade components for everything they cover: Box, Text, Heading, Display, Amount, Button, Card, Badge, Alert, Avatar, BottomNav, BottomSheet, Collapsible, StepGroup, SegmentedControl, Toast, OTPInput, Radio, charts.
- Bottom sheets render through `SheetPortal` so they sit above the BottomNav.
- Inside the animated routes React Router reports every navigation as "back". Anything that depends on navigation type (like `PlanResetOnEntry`) must render outside them.
- Never hardcode colours, spacing, radius or motion. Use Blade tokens (`theme.colors...`, `spacing.x`, `theme.motion...`).
- Use the Blade MCP (`blade-mcp` in `.mcp.json`) to fetch component docs before using a component you haven't used yet.
- Blade's `SliderInput` does not render correctly here. Use `RangeSlider` (`src/components/app/RangeSlider.tsx`, native range input, Blade tokens only). Its "Kosh recommends" flag and notch use the same maths as the thumb, so they line up exactly; the flag fills in when the slider sits on Kosh's amount.
- Show money with Blade `Amount` in INR, Indian grouping (₹5,00,000).

## Copy rules
- Plain words. Short sentences. Rupees, not percentages, wherever possible.
- No jargon on main screens: no XIRR, no expense ratio. NAV appears only on a fund's own detail page.
- Anything that depends on future returns is approximate and says so: "about", "approx." or `formatApprox` (~₹). Never state future earnings as a fact.
- Voice: amounts and the cushion are always "Kosh recommends" or "Kosh projects", never a formula. Lead with: surplus invested earns more returns and stays 100% liquid.
- Inside the app, compare Kosh in rupees with idle cash in the current account only (0%, ₹0). No FD comparison anywhere in the app.
- On the landing page only, the auto-sweep FD is quoted at one reference rate of 4% a year (`plan.sweepFd.referencePct`, via `sweepFdEarns()`), with the bank's real range and source in the footnote.
- Landing page: every section opens with `SectionIntro` (numbered label, strong title, one line on what the section shows). Labels are sentence case at body size via `Label`; no small grey capital labels. Muted grey is for sources and footnotes only. Any prototype screen shown needs a caption saying what Kosh is doing in it. Every market number names its source.
- Home: balance, three stat cards, Kosh's card, an earnings card, liquidity card. The earnings card compares against FD and idle before investing, and becomes "Your money is compounding" after, with the money's path across the cycle (`CycleGrowth`: so far, and where it is heading).
- Show the growth of the invested surplus wherever the merchant looks after investing: Home's compounding card, the Kosh page, Portfolio, the demo-controls card, every fast-forward summary and the completion card.
- The Kosh page follows the merchant's standing (`standing()`): nothing invested or under Kosh's recommendation → Kosh recommends, sliders on the top card, split pre-filled. At the recommendation → green confirmation, no sliders, nothing pre-filled; "Want to invest more?" starts at zero with no funds picked. Over it → "you might need to withdraw", naming the payments. These states come from what is invested, never from where the sliders are.
- Type sizes step down within a card: title, then message, then controls. Slider values are body size, never larger than the message above them.
- Cash-flow screens separate "tracked by Razorpay" (solid) from "Kosh projects" (light), and name the real Razorpay products behind the data. Do not claim Razorpay features that don't exist: Cashflow Insights shows past inflow and payouts; the Cashflow Forecaster agent predicts 3 to 7 days ahead; the 12-month projection is Kosh's.
- Funds are real schemes with real NAV history (`src/data/funds.ts`, snapshot in `funds.generated.json`, refresh with `node scripts/fetch-funds.mjs`). Never invent a fund name, NAV or return. "Could earn" figures use the funds' pace over the last 12 months and are labelled as estimates. Keep the one-line statutory disclaimer on the Kosh and fund pages.

## Code rules
- Small components. One folder per screen in `src/screens/`. Shared pieces in `src/components/`.
- Typed mock data in `src/data/`. Forecast logic in `src/lib/forecast.ts` (pure functions, easy to explain).
- Page transitions with framer-motion using Blade motion tokens.

## Build log (required for submission)
- After each milestone, add one entry to `docs/ai-build-log.md`: what you asked Claude Code, what it produced, what you decided yourself.

## Commands
- `npm run dev` to run
- `npm run build` to check types and build
