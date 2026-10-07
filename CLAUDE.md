# RazorpayX Surplus Cash Optimizer (Buildathon prototype)

## What this is
- Entry for the Razorpay Buildathon, track "Razorpay in Your Pocket" (mobile). Brief: `Razorpay - FSB.docx` (git-ignored). Re-check every build against it: problem, merchant, today's friction, why mobile, a flow under 2 minutes, decisions and what was left out, metrics.
- **RazorpayX Kosh**: a treasury agent in the RazorpayX app. It tells an SME owner what's safe to invest, and invests it in one tap. Name lives in `src/brand.ts`.
- Read `docs/product-spec.md` before building any screen. Read `docs/design-system.md` before writing any UI. Use `docs/mock-data.md` for every number shown.

## Hard rules
- Two parts. The landing page (`/`) is a responsive pitch page in the razorpay.com/x style, with its own nav. The app demo (`/app/*`) is mobile only, including its header.
- App demo: design for 360 to 440 px wide. On laptops, show the same mobile layout in a centred, full-height column, max 480 px wide (like urbanofashion.com). No phone bezel, no desktop layouts.
- Every visible control belongs to the demo. No dead tabs, no "not part of this demo" messages. Tabs: Home, Kosh, Portfolio.
- One job: find what's safe and invest it. Do not build: auto-invest, auto-redeem, confidence scores, onboarding or KYC, regulatory screens, fund search, a credit application flow, a full transactions dashboard. (Instant credit on withdrawal is a promise in the withdraw flow, not a credit product.)
- The core flow (nudge to order placed) must be completable in under 2 minutes. The order screen shows the real time taken.
- Frontend only. No backend. All data comes from `src/data/`. The forecast is a mocked function. Demo state lives in `src/state/demo.tsx`.

## Stack
- Vite + React 18 + TypeScript
- `@razorpay/blade` (Razorpay's own design system, MIT) with `styled-components@5`, `framer-motion@11`, `@razorpay/i18nify-js`, `@razorpay/i18nify-react`
- `react-router-dom@6` for screens
- Install with `npm i --legacy-peer-deps` (Blade lists React Native peers we don't use)
- Stay on React 18. Blade uses styled-components v5.

## Design rules
- Use Blade components for everything they cover: Box, Text, Heading, Display, Amount, Button, Card, Badge, Alert, Avatar, BottomNav, BottomSheet, Collapsible, StepGroup, SegmentedControl, Toast, OTPInput, Radio, charts.
- Bottom sheets render through `SheetPortal` so they sit above the BottomNav.
- Never hardcode colours, spacing, radius or motion. Use Blade tokens (`theme.colors...`, `spacing.x`, `theme.motion...`).
- Use the Blade MCP (`blade-mcp` in `.mcp.json`) to fetch component docs before using a component you haven't used yet.
- Blade's `SliderInput` does not render correctly here. Use `AmountSlider` (`src/components/app/AmountSlider.tsx`, native range input, Blade tokens only).
- Show money with Blade `Amount` in INR, Indian grouping (₹5,00,000).

## Copy rules
- Plain words. Short sentences. Rupees, not percentages, wherever possible.
- No jargon on main screens: no XIRR, no NAV, no expense ratio. Put those behind a "Details" tap if at all.
- Always compare with sweep FD and idle cash in rupees.

## Code rules
- Small components. One folder per screen in `src/screens/`. Shared pieces in `src/components/`.
- Typed mock data in `src/data/`. Forecast logic in `src/lib/forecast.ts` (pure functions, easy to explain).
- Page transitions with framer-motion using Blade motion tokens.

## Build log (required for submission)
- After each milestone, add one entry to `docs/ai-build-log.md`: what you asked Claude Code, what it produced, what you decided yourself.

## Commands
- `npm run dev` to run
- `npm run build` to check types and build
