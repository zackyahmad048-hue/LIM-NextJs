# Kaca Kristal — Glassmorphism Visual Overhaul

Status: ready-for-agent

> **Triage state.** `ready-for-agent` — fully specified, ready for an AFK agent. No further triage needed.

## Problem Statement

The owner judged the previous visual design of LIM-NextJs as "jelek banget" (really ugly) and asked for a brand-new visual world from scratch. The earlier direction had applied glassmorphism and aurora effects too broadly — as a surface-wide wallpaper — which hurt readability and read as generic. The functional decisions (mobile-first, dual-mode with dark as default, hamburger nav) are locked and must stay; only the visual language may change.

## Solution

The "Kaca Kristal" visual system: glassmorphism used **deliberately and sparingly** — on navigation chrome and summary cards only. Every data-dense surface (tables, forms, long-form text, image media cards) stays solid for readability. Glass is CSS-only via global `--glass-*` tokens that derive from semantic tokens, so it's valid in both light and dark themes, degrades gracefully under `prefers-reduced-transparency`, and stays performant on mobile. All of this is codified in the design docs (`design.md`, `docs/08-design-system/*`, `PRODUCT.md`) and enforced by a contract test so the surface rules don't erode over time.

## User Stories

**Public website**

1. As a visitor, I want the public navbar to become a subtle glass scrim only after I scroll, so that content glides underneath while navigation stays readable.
2. As a visitor at the top of the page, I want the navbar solid, so it stays crisp against the hero.
3. As a visitor, I want the taqwim widget in the hero to sit on a translucent glass panel, so it reads as the centerpiece that demonstrates the site's hisab expertise.
4. As a visitor, I want article and program cards to be glass cards, so the public pages feel cohesive without reducing legibility.
5. As a visitor reading a long article, I want the text surface to stay solid, so I can read comfortably for extended periods.
6. As a visitor viewing data tables (e.g. jadwal shalat, pengurus, angka falak), I want them solid, so numbers and coordinates stay crisp.
7. As a visitor filling a form (e.g. kontak), I want form fields solid, so I can type without visual noise behind the input.
8. As a visitor, I want the glass surfaces to work identically in light and dark mode, so I can switch themes freely.

**Admin**

9. As an admin, I want the sidebar and topbar to use glass chrome, so the dashboard feels light and layered rather than flat.
10. As an admin, I want KPI/stat summary cards to be glass, so key metrics are visually elevated.
11. As an admin, I want module/content cards to be glass, so the admin surface shares the same visual language as the public site.
12. As an admin, I want tables, forms, and dense data lists to stay solid, so records remain legible during long working sessions.
13. As an admin on mobile, I want the mobile sidebar and header to follow the same glass language, so the experience is consistent across breakpoints.

**Accessibility & reduced preferences**

14. As a user with `prefers-reduced-transparency`, I want every glass surface to fall back to a solid surface, so translucency never bothers me.
15. As a user with `prefers-reduced-motion`, I want the navbar not to animate into glass and the aurora background to be hidden, so the interface stays stable.
16. As a user, I want text rendered over glass to remain WCAG AA contrast-compliant in both themes, so the effect never sacrifices readability.
17. As a user on a low-end mobile device, I want the aurora background to render at reduced resolution/intensity/speed, so the page stays smooth.

**Engineering & maintainability**

18. As a developer, I want a single global set of `--glass-*` tokens, so glass values are never hardcoded in components.
19. As a developer, I want a documented rule that glass applies only to chrome + cards, enforced by a contract test, so the surface boundaries don't erode in future work.
20. As a developer, I want glass on card surfaces to be CSS-only (no JS or WebGL), so behavior is predictable and cheap.
21. As a developer, I want animations/transitions to touch only the compositor path (transform/opacity/color), so scroll and repaint stay smooth.
22. As a developer, I want the leftover Roboto `--font-sans` deviation in `layout.tsx` removed, so the documented four-font system (Newsreader, Hanken Grotesk, Spline Sans Mono, Reem Kufi) is authoritative.
23. As a developer, I want the design docs to remain the source of truth for the glass rules, so the spec and docs never drift.

## Implementation Decisions

**Token contract** (already implemented in `app/globals.css`, matching `docs/08-design-system/theme.md`):

- `--glass-chrome-bg`: `color-mix(in oklab, var(--background) 80%, transparent)` light; 85% in `.dark` (Apple-style near-opaque scrim).
- `--glass-card-bg`: 65% light; 70% in `.dark` (Fey-style thin translucency).
- `--glass-border`: `var(--border)` at 70%.
- `--glass-highlight`: inset top 1px white highlight (0.08 alpha).
- `--glass-blur`: 20px desktop, 12px at `max-width: 767px`.
- `--glass-saturate`: 1.8 to keep text legible over blurred content.
- `@media (prefers-reduced-transparency: reduce)`: resets `--glass-chrome-bg`/`--glass-card-bg` to `var(--background)`, `--glass-blur` to 0, `--glass-saturate` to 1 — solid fallback.

**Primitives** (existing, reused everywhere):

- `GlassCard` — global glass card primitive, Server Component, CSS-only, polymorphic `as` + `className`.
- `GlassPanel` — public-site glass panel, Server Component, CSS-only, same props contract.
- Shared primitives (`SectionCard`, `PostCard`, …) expose a `variant: "default" | "glass"` prop rather than forking new components, so opt-in per surface is explicit.

**Chrome behavior**:

- Public navbar: solid at top, transitions to glass once `scrollY > 8px`, gated by `useReducedMotion`, CSS transitions on color/opacity only.
- Admin sidebar/topbar/mobile sidebar: glass chrome via tokens.

**Aurora background**:

- Client component (LiquidEther shader from `@paper-design/shaders-react`), renders nothing until hydration, `null` under reduced-motion.
- Mobile-optimized: resolution 0.35, `autoIntensity × 0.5`, `autoSpeed 0.25`.

**Hard rules** (must remain solid): tables, forms, long-form text/articles, dense data areas, image media cards.

**Non-negotiable scope guards**: no change to mobile-first, dual-mode (default dark), or hamburger nav; glass never becomes a site-wide wallpaper.

## Testing Decisions

- **What makes a good test here:** assert the *behavioral contract*, not implementation detail. Good tests: "glass tokens exist globally and resolve to solid under reduced-transparency", "a data-dense surface never references glass tokens". Bad tests: snapshotting a component's exact class string (brittle, tests the diff not the rule).
- **Seam (single, confirmed):** a static source-level contract test mirroring `tests/accessibility/autocomplete.test.ts` — a rule mirror that walks `app/`, `components/`, `modules/` and asserts over source text. It should assert:
  1. Every `backdrop-blur` / `backdrop-saturate` usage references only the `--glass-*` tokens (no hardcoded blur/alpha values).
  2. No prohibited surface (elements inside a `table`, `form`, or long-form/article container) references glass tokens.
  3. The fallback contract exists in `app/globals.css`: a `prefers-reduced-transparency` block resetting glass tokens, and reduced-motion gating for scroll-glass and aurora.
  4. The token contract holds: every required `--glass-*` token is defined in both `:root` and `.dark`.
- **Prior art:** `tests/accessibility/autocomplete.test.ts` (existing static source audit over the same directories); Vitest config with `@` alias resolution already in place.

## Out of Scope

- New colors or new font families beyond the documented four-font system.
- Converting prohibited surfaces (tables/forms/long-form) to glass.
- JS/WebGL glass on card surfaces (only the aurora background may use a shader).
- Changing the locked functional decisions (mobile-first, dual-mode, dark default, hamburger nav).
- New animations beyond the subtle compositor-path transitions already defined.
- Any rework of the aurora shader itself beyond the existing mobile parameters.

## Further Notes

- The owner rejected the previous broad aurora/glass-everywhere direction; "Kaca Kristal" is the approved replacement, already partially implemented in the current working tree (navbar, sidebar, stat cards, taqwim hero, post cards) and reflected in the design docs.
- This spec defines the complete rule set so remaining surfaces are finished consistently and the contract test can guard the boundaries going forward.
- Documentation (`docs/08-design-system/theme.md` §Glassmorphism, `docs/08-design-system/colors.md`, `design.md` §4, `PRODUCT.md`) is the source of truth; this spec is written to keep them in sync, not replace them.