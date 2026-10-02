# RazorpayX Surplus Cash Optimizer (Buildathon prototype)

## What this is
- Entry for the Razorpay Buildathon, track "Razorpay in Your Pocket" (mobile).
- A feature inside the RazorpayX mobile app. It tells an SME owner how much idle cash is safe to invest for a short time, and lets them invest it in a few taps.
- Read `docs/product-spec.md` before building any screen. Read `docs/design-system.md` before writing any UI. Use `docs/mock-data.md` for every number shown.

## Hard rules
- Two parts. The landing page (`/`) is a responsive marketing page in the razorpay.com/x style. The app demo (`/app/*`) is mobile only.
- App demo: design for 360 to 440 px wide (every current phone). On laptops, show the same mobile layout in a centred, full-height column, max 480 px wide, with a plain background either side (like urbanofashion.com). No phone bezel, no desktop layouts.
- A fixed RazorpayX top nav (logo and name on the left) sits on every path.
- Simple, no-nonsense app. One job: find safe surplus and invest it. Do not add features that are not in the spec.
- Do not build: auto-invest, auto-redeem, confidence scores, onboarding or KYC, regulatory screens, fund search, a credit flow, a full transactions dashboard.
- The core flow (Home to Success) must be completable in under 2 minutes.
- Frontend only. No backend. All data comes from `src/data/`. The forecast is a mocked function.

## Stack
- Vite + React 18 + TypeScript
- `@razorpay/blade` (Razorpay's own design system, MIT) with `styled-components@5`, `framer-motion@11`, `@razorpay/i18nify-js`, `@razorpay/i18nify-react`
- `react-router-dom@6` for screens
- Install with `npm i --legacy-peer-deps` (Blade lists React Native peers we don't use)
- Stay on React 18. Blade uses styled-components v5.

## Design rules
- Use Blade components for everything they cover: Box, Text, Heading, Amount, Button, Card, Badge, Alert, BottomNav, BottomSheet, Collapsible, ProgressBar, Toast, OTPInput, Skeleton, Radio, Chip.
- Never hardcode colours, spacing, radius or motion. Use Blade tokens (`theme.colors...`, `spacing.x`, `theme.motion...`).
- Use the Blade MCP (`blade-mcp` in `.mcp.json`) to fetch component docs before using a component you haven't used yet.
- Blade has no slider. Build one small `AmountSlider` component on a native range input, styled only with Blade tokens.
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
