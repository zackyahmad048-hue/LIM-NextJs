# 01: Homepage UI Refinements

**What to build:** Glass capsule navbar memiliki border tipis yang konsisten, stat cards hero ter-center secara horizontal.

**Blocked by:** None (can start immediately)

**Status:** resolved

## Acceptance criteria

- [ ] Glass capsule navbar: `border-border/40` terlihat di kedua mode (default rounded & scrolled full-width)
- [ ] Individual pill menu items tidak memiliki border
- [ ] StatRule `<dl>` di hero: `text-center` untuk center alignment value dan label
- [ ] Reduced motion: transisi capsule border tetap smooth (mengikuti existing `transition-[width,border-radius,box-shadow,border-color]`)
