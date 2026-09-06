# 03: Bidang Auto-Scroll + Homepage Entrance Animation

**What to build:** Sektor bidang bergerak otomatis secara horizontal (marquee looping seamless) + seluruh section homepage memiliki entrance animation Reveal yang konsisten.

**Blocked by:** None (can start immediately)

**Status:** resolved

## Acceptance criteria

- [ ] Bidang items diduplikasi untuk seamless loop
- [ ] Menggunakan `@keyframes marquee-seamless` (translateX 0 → -50%), durasi 30s linear infinite
- [ ] Pause on hover (animationPlayState paused/running via onMouseEnter/onMouseLeave)
- [ ] Gradient fade di tepi kiri-kanan (`bg-linear-to-r from-background to-transparent`)
- [ ] Reduced motion: marquee tidak berjalan (`useReducedMotion()` cek)
- [ ] BidangCarousel dibungkus `<Reveal from="scale">`
- [ ] Hero stat cards: `Reveal delay={0.3}` (sudah ada)
- [ ] Hero widget: `Reveal from="scale" startScale={0.85}` (sudah ada)
- [ ] About/ArticleBento: Reveal sudah konsisten (tidak perlu ubah)
