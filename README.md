# Wazly

AI customer conversation platform for WhatsApp, Instagram, Messenger and Facebook
comments — marketing site plus a full product UI, built with React, TypeScript,
Vite and Tailwind CSS.

> This is a front-end product demo. All data comes from `src/lib/mockData.ts`;
> there is no backend wired up.

## Getting started

```bash
npm install
npm run dev
```

The dev server prints a local URL (Vite defaults to <http://localhost:5173>).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` against `tsconfig.app.json` |
| `npm run lint` | ESLint across the repo |
| `npm run verify` | typecheck → lint → build, in one command |

Run `npm run verify` before pushing. It is the same sequence CI would run, and
it fails fast on the first broken step.

Note that `@typescript-eslint/no-unused-vars` and `no-explicit-any` are **errors**
(not warnings) under `tseslint.configs.recommended`, so an unused import or a
stray `as any` will fail `npm run lint`.

## Application structure

`src/App.tsx` owns three top-level states — `landing`, `onboarding` and `app` —
and wraps everything in `ThemeProvider`. Whether onboarding has been completed is
persisted to `localStorage` under `wazly-onboarded`; the light/dark preference is
persisted under `wazly-theme`.

Inside the app shell, `AppView` selects the active view:

| Route | View | File |
| --- | --- | --- |
| `overview` | Dashboard with KPIs, charts, live status | `app/Overview.tsx` |
| `inbox` | Three-column live inbox | `app/LiveInbox.tsx` |
| `customers` | Lead table with filters and bulk actions | `app/Customers.tsx` |
| `leads` | Animated lead qualification and scoring | `app/LeadQualification.tsx` |
| `ai` | AI Playground | `app/AIPlayground.tsx` |
| `knowledge` | Knowledge base and indexing pipeline | `app/Knowledge.tsx` |
| `analytics` | Animated charts, channel distribution | `app/Analytics.tsx` |
| `integrations` | Connection wizard | `app/Integrations.tsx` |
| `team` | Team members and performance | `app/Team.tsx` |
| `billing` | Billing and usage | `app/Billing.tsx` |

```
src/
  App.tsx                  # theme provider + routing
  index.css                # design tokens, utilities, keyframes
  components/
    ui.tsx                 # shared primitives
    app/                   # product views + AppShell
    landing/               # marketing page and its animations
  lib/
    theme.tsx              # ThemeProvider / useTheme
    hooks.ts               # useReveal, useCountUp, useTypewriter, …
    mockData.ts            # all demo data
```

## Design system

**Tokens.** `tailwind.config.js` defines the `brand`, `accent` and `ink` colour
scales, the `soft → glow-strong` shadow ramp and the `smooth` / `swift` /
`snappy` easings. `src/index.css` layers CSS custom properties
(`--bg`, `--border`, `--text`, `--brand`, …) on top, which is what makes dark
mode a single `class` swap on `<html>`.

**Fonts.** Inter for UI, Noto Kufi Arabic for Arabic copy (`font-arabic`) and
JetBrains Mono for code (`font-mono`).

**Animations.** Sixteen keyframes ship in `index.css` — `fade-in`, `fade-in-up`,
`fade-in-down`, `slide-in-right`, `slide-in-left`, `scale-in`, `pulse-soft`,
`pulse-dot`, `shimmer`, `blink`, `bounce-soft`, `draw-line`, `grow-bar`,
`float-up`, `spin-slow` and `gradient-shift` — all disabled under a
`prefers-reduced-motion` media query.

**Primitives.** `src/components/ui.tsx` exports `ChannelIcon`, `ChannelBadge`,
`StatusDot`, `Badge`, `Card`, `Button`, `Tooltip`, `ProgressBar`, `Skeleton` and
`TypingIndicator`.

## Shared hooks

`src/lib/hooks.ts` exports `useReveal` (IntersectionObserver scroll reveal),
`usePrefersReducedMotion`, `useCountUp`, `useTypewriter`, `useTimeline`,
`useLoopingTimeline`, `useInterval`, `useLocalStorage`, `usePrevious` and
`useStableCallback`.

Every animated component checks `usePrefersReducedMotion()` and jumps straight to
its final state instead of animating.

## Path alias

`@/*` resolves to `src/*`, configured in both `vite.config.ts` and
`tsconfig.app.json`.
