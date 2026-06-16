# DESIGN.md — Levant AI design system

Dark, terminal-grade fintech workspace. Tokens are defined in OKLCH in
[apps/web/src/index.css](apps/web/src/index.css) and surfaced to Tailwind in
[apps/web/tailwind.config.js](apps/web/tailwind.config.js). This file is the human-readable
spec; the CSS file is the source of truth.

## Color strategy

**Restrained + semantic.** Tinted near-black neutrals carry the surface; a blue→violet
accent appears only on the active nav rail, primary actions and focus rings (well under
10% of the surface). Green/red are reserved strictly for P/L and trade outcome, never
decoration. Every neutral is tinted toward the brand hue (~265) at chroma 0.006–0.012 so
nothing is a dead gray. No `#000`, no `#fff`.

| Role | OKLCH | Was (ref hex) |
|---|---|---|
| `bg` | `oklch(0.15 0.008 265)` | #0A0B0D |
| `surface` | `oklch(0.21 0.008 265)` | #16181D |
| `surface-2` | `oklch(0.26 0.010 265)` | #1C1F26 |
| `sidebar` | `oklch(0.17 0.007 265)` | #0D0E11 |
| `border` | `oklch(0.32 0.012 265)` | #23262D |
| `text` | `oklch(0.97 0.004 265)` | #F4F5F7 |
| `text-muted` | `oklch(0.66 0.012 265)` | #8A8F98 |
| `accent` | `oklch(0.62 0.20 262)` | #2D6BFF |
| `accent-2` | `oklch(0.55 0.25 292)` | #7A3BFF |
| `pos` (profit) | `oklch(0.76 0.17 150)` | #22C55E |
| `neg` (loss) | `oklch(0.65 0.22 25)` | #EF4444 |

Accent gradient (135deg `accent`→`accent-2`) is allowed on button/nav **backgrounds** only.
Gradient text is banned.

## Typography

- **Inter** (variable), with `font-variant-numeric: tabular-nums` on all figures so columns
  align. Loaded in [apps/web/index.html](apps/web/index.html).
- Scale (≥1.25 contrast): page title 20px/600, section 16px/600, body 14px/450,
  label/caption 12px/500 uppercase tracking-wide in `text-muted`.
- Numbers in tables and KPIs are right-aligned and tabular.

## Elevation & shape

- Flat. Depth comes from surface lightness steps + 1px hairline borders, not drop shadows.
- One soft shadow allowed on floating elements (toasts, dropdowns, menus).
- Radius: 14px cards/panels, 10px buttons/inputs, full pills for badges.
- **No side-stripe accent borders.** Status is shown with a tinted-background pill, not a
  colored left edge.

## Components

- **AppShell**: fixed ~232px sidebar + top bar + scrolling content.
- **Sidebar**: logo, icon+label nav, active item = accent-gradient fill with left rail glow;
  bottom community card.
- **Topbar**: greeting, search, theme toggle, notification bell, user chip.
- **StatCard / KPI strip**: compact metric cells, full hairline borders, value colored only
  when semantic (P/L). Deliberately NOT the hero-metric template.
- **Table**: dense rows, hover highlight, tabular numerals, status & source **pill badges**,
  inline action icons (edit = accent, close = neg).
- **Badge**: pill, tinted background + matching text. Variants: success, danger, neutral,
  accent, info.
- **Button**: primary (accent gradient), secondary (surface-2 + border), ghost, danger.
- **Toast**: bordered + bg-tinted card, soft shadow, top-right. Error variant for partial
  failures (per the reference's "Partial Failure Closing Pair Trade").

## Motion

- Ease-out only (`cubic-bezier(0.22, 1, 0.36, 1)`), 120–220ms. No bounce/elastic.
- Animate opacity/transform only, never layout properties.
- Hover/active states on rows, nav, buttons; toast slide-in from the right.
