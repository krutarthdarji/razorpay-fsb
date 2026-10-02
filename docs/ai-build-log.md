# AI Build Log

The brief asks: which AI tools, what for, how they helped, where we made the key decisions.

| # | Phase | Tool | What AI did | What I decided |
|---|---|---|---|---|
| 1 | Research | Claude (Cowork) | Market research, competitor scan (Axis Account Plus, Idlewise, SumUp), sweep FD vs liquid fund maths, Razorpay product landscape (found Cashflow Forecaster) | Idea, positioning vs sweep FD, behaviour-based segment |
| 2 | Product | Claude (Cowork) | Stress-tested ideas (Instant Redeem, sizing, cushion screen) | Instant Redeem as a promise only, single recommended amount with slider, what not to build |
| 3 | Design setup | Claude (Cowork) | Found Razorpay's Blade design system and Blade MCP, extracted real tokens, wrote CLAUDE.md and specs | Use Blade as source of truth, 7 screens, mobile only |
| 4 | Build: setup + Home | Claude Code + Blade MCP | Planned first, then scaffolded Vite + React 18 + TS, installed Blade, set up BladeProvider, fonts, i18nify (en-IN for ₹5,00,000 grouping), router, 390x844 phone frame and token-based page transitions. Typed mock data in `src/data/`, pure forecast maths in `src/lib/forecast.ts` (safe amount and earnings are computed, not hard-coded). Built Home: balance card, nudge card, BottomNav with "Not part of this demo" toast. Read component docs from the Blade MCP knowledge base. Checked it in headless Chrome at desktop and 360px, and fixed toasts covering the nav | Reviewed the plan before any code. Kept outflow dates as given. Stub routes for screens not built yet. Shared state deferred to Redeem |
| 5 | Build: mobile-only shell | Claude Code | Studied urbanofashion.com on a laptop (centred 480 px full-height column). Replaced the 390x844 phone frame with that: full width on phones, centred column on laptops, height follows the browser (`100dvh`), iPhone notch and home-indicator padding, no page bounce. Checked 8 sizes from 360 px phones to 1920 px desktop | Mobile-only layout everywhere, modelled on urbanofashion.com instead of a phone mock-up |
