# Homepage UI Polish

Polishing homepage: navigation border, widget responsive + clock, bidang marquee, entrance animation consistency.

## Decisions-so-far

- Navigation capsule border: `border-border/40` (semi-transparent), individual pill items tanpa border
- Prayer widget responsive: `max-w-[18rem] sm:max-w-[20rem] lg:max-w-88`, padding scaled
- Widget clock: `formatTime(decimalHours, true)` — HH:MM:SS, mengikuti mode (standar/WIS)
- Bidang marquee: `@keyframes marquee-seamless` (-50%), 30s linear infinite, pause on hover
- Entrance animation: `Reveal from="scale"` untuk BidangCarousel, sisanya sudah konsisten

## Fog

- (none)

## Children

- [01-homepage-ui-refinements](issues/01-homepage-ui-refinements.md)
- [02-prayer-widget-mobile-clock](issues/02-prayer-widget-mobile-clock.md)
- [03-bidang-marquee-entrance-animation](issues/03-bidang-marquee-entrance-animation.md)
- [04-design-system-docs-update](issues/04-design-system-docs-update.md)
