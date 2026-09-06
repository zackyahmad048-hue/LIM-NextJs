# 04: Design System Docs Update

**What to build:** Dokumentasi design system (`motion.md`, `theme.md`, `layout.md`) ter-update mencerminkan pola baru yang sudah diimplementasikan.

**Blocked by:** 01-homepage-ui-refinements, 02-prayer-widget-mobile-clock, 03-bidang-marquee-entrance-animation (semua implementasi harus selesai)

**Status:** resolved

## Acceptance criteria

- [ ] `docs/08-design-system/motion.md`: tambah catatan tentang `@keyframes marquee-seamless` + aturan reduced-motion untuk marquee (pause on hover, `useReducedMotion()` check)
- [ ] `docs/08-design-system/theme.md`: update navbar capsule border spec (`border-border/40` pada glass capsule, individual pill items tanpa border)
- [ ] `docs/08-design-system/layout.md`: catatan widget responsive sizing pattern (`max-w-[18rem] sm:max-w-[20rem] lg:max-w-88`)
