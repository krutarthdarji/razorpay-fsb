# Design System Notes

## Source of truth: Blade
- Blade is Razorpay's own design system, open source (MIT). npm `@razorpay/blade` (v12.x as of Oct 2026).
- It powers Razorpay's products, so using it gives the real Razorpay look, fonts, colours and motion.
- Blade MCP (`@razorpay/blade-mcp`) gives Claude Code the official component docs. Tools: `get_blade_component_docs`, `get_blade_pattern_docs`, `get_blade_general_docs`.

## Setup
```tsx
import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import '@razorpay/blade/fonts.css';

<BladeProvider themeTokens={bladeTheme} colorScheme="light">
  <App />
</BladeProvider>
```
- Install: `npm i --legacy-peer-deps @razorpay/blade styled-components@5 framer-motion@11 @razorpay/i18nify-js @razorpay/i18nify-react react-router-dom@6`
- Tested: Vite 5 + React 18.3 + Blade 12.127 builds clean.

## Fonts (from Blade tokens)
- Headings: TASA Orbiter
- Body: Inter
- Code: Menlo
- Mobile size scale (px): 10, 11, 12, 14, 16, 18, 20, 24, 32, 34, 36, 38, 40

## Key colours (light theme, for reference only. Use tokens in code)
| Token | Value | Approx hex |
|---|---|---|
| interactive.background.primary.default | hsla(218, 89%, 51%) | #1364F1 |
| interactive.background.primary.highlighted | hsla(218, 87%, 43%) | #0E54CD |
| surface.background.gray.moderate | hsla(0, 0%, 97%) | #F7F7F7 |
| surface.background.gray.intense | white | #FFFFFF |
| surface.text.gray.normal | hsla(0, 0%, 2%) | #050505 |
| surface.text.gray.muted | hsla(204, 9%, 42%) | #616D75 |
| feedback.text.positive.intense | hsla(150, 100%, 23%) | #00753B |
| feedback.text.notice.intense | hsla(25, 100%, 39%) | orange |

## Spacing (spacing.N in px)
- 0:0, 1:2, 2:4, 3:8, 4:12, 5:16, 6:20, 7:24, 8:32, 9:40, 10:48, 11:56
- Screen side padding: spacing.5 (16px)

## Radius
- xsmall 4, small 8, medium 12, large 16, xlarge 20, 2xlarge 24, round 50%
- Cards: medium (12). Bottom sheets: large or xlarge top corners.

## Elevation
- lowRaised: 0 2px 4px hsla(200,10%,18%,0.06)
- midRaised: 0 16px 12px hsla(200,10%,18%,0.06)
- highRaised: 0 8px 24px -4px hsla(200,10%,18%,0.06)

## Motion
- Durations (ms): 2xquick 80, xquick 160, quick 200, moderate 280, xmoderate 360, gentle 480, xgentle 640, 2xgentle 960
- Easings: entrance cubic-bezier(0,0,0.2,1), exit cubic-bezier(0.17,0,1,1), standard cubic-bezier(0.3,0,0.2,1), emphasized cubic-bezier(0.5,0,0,1), overshoot cubic-bezier(0.5,0,0.3,1.5)
- Page push: slide from right, moderate, entrance easing. Back: exit easing.
- Success: scale with overshoot easing.
- Blade also ships motion presets: Fade, Slide, Move, Scale, Stagger, Morph, AnimateInteractions.

## Mobile components to use
- BottomNav (2 to 5 items), BottomSheet, Card, Amount, Collapsible, Alert, Toast, OTPInput (MPIN), ProgressBar, Skeleton, Badge, Chip, Radio, Button, IconButton, TopNav is desktop-first so build a simple app bar with Box.
- No Slider in Blade. Build AmountSlider on `<input type="range">` styled with tokens.

## RazorpayX app references (public listing)
- RazorpayX mobile app covers: balance, payouts, beneficiaries, approvals, payout links, insights, Scan & Pay, biometric login.
- Pattern to mirror: balance-first home, bottom navigation, approve or confirm with MPIN.
- We could not inspect app screenshots directly. Blade is the closest reliable source for look and feel.

## Sources
- https://github.com/razorpay/blade
- https://www.npmjs.com/package/@razorpay/blade
- https://www.npmjs.com/package/@razorpay/blade-mcp
- https://razorpay.com/x/mobile-app/
- https://apps.apple.com/in/app/razorpayx/id1542911810
