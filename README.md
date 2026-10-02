# RazorpayX Surplus Cash Optimizer: Claude Code starter

## Start
1. Put this folder where you want the project. Open it in a terminal.
2. Run `claude`. Approve the `blade-mcp` server when asked.
3. Paste the kickoff prompt below.

## Kickoff prompt
```
Read CLAUDE.md and everything in docs/. Then:
1. Scaffold a Vite + React 18 + TypeScript app in this folder (keep CLAUDE.md, docs/ and .mcp.json).
2. Install Blade and its deps with --legacy-peer-deps as listed in CLAUDE.md.
3. Set up BladeProvider, fonts, react-router, and a phone frame (390x844) for desktop.
4. Put the mock data from docs/mock-data.md into typed files in src/data/ and the forecast maths in src/lib/forecast.ts.
5. Build only the Home screen first, with the nudge card and BottomNav. Use Blade MCP for component docs.
Show me the plan before writing code.
```

## Then, one screen at a time
- Insight → Option → Invest (with AmountSlider and MPIN) → Success → Portfolio → Redeem
- After each screen: run it, check it on a phone-width view, add a line to docs/ai-build-log.md.

## Deploy
- Push to GitHub and import into Vercel. Share the link in the submission.
