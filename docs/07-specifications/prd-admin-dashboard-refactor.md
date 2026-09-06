# PRD: Admin CMS Dashboard Refactor

**Project:** LIM Digital Platform
**Document:** `prd-admin-dashboard-refactor.md`
**Version:** 1.0
**Status:** Completed
**Date:** 2026-08-29

> **⚠️ Superseded (2026-09-06, oleh `spec-admin-permukaan-tenang.md`).** PRD ini tetap sebagai catatan historis refactor 2026-08 yang selesai; resep berikut sudah digantikan:
> - **Font**: Bebas Neue/Lato/unifony → **Fraunces/Inter** (`docs/08-design-system/typography.md`).
> - **Komposisi kartu** (§ menyangkut kartu statistik, module cards, glass hover-lift, sturctural cards): → **komposisi permukaan tenang** (`band`/`stat-strip`/`stat-row`/`list-row`/`data-table`), kartu hanya untuk form-group & tabel. Perbedaan keputusan tercatat di `.scratch/admin-redesign/issues/01`–`05`.

---

## 1. Executive Summary

### 1.1 Problem Statement
Admin CMS dashboard memiliki UI/UX yang tidak konsisten, menggunakan font legacy (Roboto, Hanken Grotesk, Newsreader, Spline Sans Mono), glassmorphism berlebihan di kartu data (mengganggu keterbacaan), sidebar gradient tidak elegan, dan tidak memiliki empty states yang ramah. Tampilan tidak memancarkan wibawa Pesantren Lirboyo.

### 1.2 Solution
Total refactor UI/UX Admin Dashboard dengan:
- **Typography eksklusif**: Bebas Neue (heading/angka), Lato (body/UI), Reem Kufi (Arab)
- **Visual hierarchy**: Glassmorphism hanya pada chrome (topbar) & kartu statistik; surface data & module cards solid
- **Sidebar gradient Nusantara** yang elegan (dark: slate-950 → emerald-950/20)
- **Empty states** estetik & informatif untuk semua kondisi data kosong
- **Purposeful motion**: hover lift, shadow transition, icon feedback

### 1.3 Success Metrics
- ✅ Build pass (TypeScript + Next.js + Prisma)
- ✅ Lint clean (0 errors)
- ✅ Dark mode default dengan kontras WCAG 2.1 AA
- ✅ Mobile-first responsive (320px → 1536px+)
- ✅ Semua halaman admin (35 routes) render tanpa error

---

## 2. Product Context

### 2.1 Target Users (Admin CMS)
| Role | Kebutuhan Dashboard |
|------|---------------------|
| Super Administrator | Overview seluruh platform, KPI global |
| Administrator | Kelola modul sesuai permission, monitoring aktivitas |
| Operator (Sekretariat/Falak/Program) | Quick access modul tugas harian, statistik operasional |
| Content Manager | Akses cepat ke Content, Media, Pages |

### 2.2 Business Goals
1. **Credibility**: Dashboard memantulkan wibawa Lirboyo — profesional, rapi, terorganisir
2. **Efficiency**: Admin menemukan modul & data < 3 detik (scanability)
3. **Trust**: Empty states ramah mengurangi kebingungan user baru
4. **Consistency**: Design system terpusat, reusable components

---

## 3. Scope

### 3.1 In Scope
| Area | Deliverable |
|------|-------------|
| **Typography** | Bebas Neue, Lato, Reem Kufi via `next/font/google`; hapus Roboto/Newsreader/Hanken/Spline |
| **Sidebar** | Gradient Nusantara refined (light & dark), collapsed/expanded smooth transition |
| **Header (Chrome)** | Glassmorphism via `glassChrome` token; `prefers-reduced-transparency` fallback |
| **Module Cards** | Solid `SectionCard` style (no glass), hover lift + shadow, focus ring accessible |
| **StatCard / MiniStat** | Bebas Neue + `tabular-nums`; glassmorphism allowed |
| **Empty States** | 3 varian: `EmptyState`, `TableEmptyState`, `DashboardEmptyState` |
| **Motion** | Hover transitions (300ms ease-out), reduced-motion safe |
| **Design Tokens** | `@utility font-body`, `@utility font-heading` di `globals.css` |

### 3.2 Out of Scope
- Backend API / database changes
- Authentication / authorization logic
- New features / modules
- Public website rebuild (separate initiative)
- Admin CMS domain logic (Content, Falak, Program, Secretariat, TWK, Reports, Structure)

---

## 4. Functional Requirements

### 4.1 Dashboard Layout (`/admin`)
| Component | Requirement |
|-----------|-------------|
| **Welcome Card** | User avatar, name, role badge, descriptive copy |
| **Module Grid** | 1 col mobile → 2 col tablet → 4 col desktop; solid cards; permission-filtered |
| **Struktur & Anggota** | 4 MiniStat cards (Pengurus Pusat, Wilayah, Cabang, Anggota); Google Sheet link + preview |
| **Profil** | Visi (truncated 120 char), Misi (max 3 items + "+N lainnya") |
| **Empty State** | Jika `enabled.length === 0` → `DashboardEmptyState` dengan CTA ke admin |

### 4.2 Typography Rules
| Element | Font | Weight | Notes |
|---------|------|--------|-------|
| Page heading (h1) | Bebas Neue | 400 | `font-heading text-xl` |
| Card titles (h2/h3) | Bebas Neue | 400 | `font-heading text-base` |
| Stat numbers | Bebas Neue | 400 | `font-heading text-3xl tabular-nums` |
| MiniStat numbers | Bebas Neue | 400 | `font-heading text-xl tabular-nums` |
| Body text, labels, desc | Lato | 400/500/600 | Default `font-body` |
| Arabic ornamental | Reem Kufi | 400-700 | `--fx-ar` variable |

### 4.3 Color & Surface Rules
| Surface | Treatment | Token |
|---------|-----------|-------|
| Sidebar | Gradient Nusantara | Custom CSS in sidebar.tsx |
| Header (chrome) | Glassmorphism | `glassChrome` (80% opacity, blur 20px/12px mobile) |
| StatCard | Glassmorphism allowed | `glassCard` (65% opacity) |
| Module Cards | **Solid** | `bg-admin-card-bg border-admin-card-border shadow-sm` |
| SectionCard (data) | **Solid** | `bg-admin-card-bg border-admin-card-border` |
| Tables, Forms, Lists | **Solid** | WCAG AA contrast mandatory |

### 4.4 Empty States
| Variant | Use Case | Visual |
|---------|----------|--------|
| `DashboardEmptyState` | No modules accessible | Large icon (48px), gradient bg, friendly copy |
| `EmptyState` | General page/section empty | Medium icon (32px), card container |
| `TableEmptyState` | Inside data tables | Compact icon (24px), minimal padding |

---

## 5. Non-Functional Requirements

| Category | Requirement | Validation |
|----------|-------------|------------|
| **Performance** | Dashboard load < 500ms (p95) | Next.js build + static generation |
| **Accessibility** | WCAG 2.1 AA contrast, keyboard nav, focus rings | `focus-visible:ring-2`, semantic HTML |
| **Responsive** | 320px - 1536px+ breakpoints | Tailwind `sm:`, `md:`, `lg:`, `xl:`, `2xl:` |
| **Motion** | ≤ 300ms transitions, `prefers-reduced-motion` respected | `motion-safe:`, `@media (prefers-reduced-motion)` |
| **Dark Mode** | Default dark, toggle persists | `next-themes`, CSS variables |
| **Browser Support** | Chrome, Firefox, Safari, Edge (last 2) | Standard CSS, no polyfills needed |

---

## 6. Design System Alignment

Referensi dokumen desain yang dipatuhi:
- `docs/08-design-system/typography.md` — Font roles & scale
- `docs/08-design-system/colors.md` — Semantic tokens, no hardcoded colors
- `docs/08-design-system/theme.md` — Glassmorphism scope (chrome + cards only)
- `docs/08-design-system/layout.md` — Admin layout, container full-width
- `docs/08-design-system/motion.md` — Easing tokens, reduced motion
- `docs/08-design-system/components.md` — Admin CMS shell primitives
- `docs/08-design-system/accessibility.md` — WCAG AA, keyboard, focus
- `docs/08-design-system/responsive.md` — Mobile-first breakpoints

---

## 7. Technical Implementation

### 7.1 Files Modified
| File | Change Type |
|------|-------------|
| `app/layout.tsx` | Font loading (Bebas Neue, Lato, Reem Kufi) |
| `app/globals.css` | `@utility font-body/heading`, admin typography CSS |
| `components/admin/layout/sidebar.tsx` | Gradient refined |
| `components/admin/layout/header.tsx` | Glass chrome via shared token |
| `components/admin/dashboard/dashboard-client.tsx` | Solid module cards, empty state, font-heading |
| `components/admin/shared/stat-card.tsx` | Bebas Neue for numbers |
| `components/admin/shared/empty-state.tsx` | **New** — 3 empty state variants |

### 7.2 Dependencies Added
- `next/font/google` — Bebas_Neue, Lato, Reem_Kufi (already in package.json)

### 7.3 Breaking Changes
- Font variables renamed: `--f-site` → `--font-body`, `--fx-display` → `--font-heading`
- CSS utilities: `.font-body`, `.font-heading` (replaces `.font-sans`, `.font-display` for admin)
- Module cards no longer use glassmorphism classes

---

## 8. Acceptance Criteria

| ID | Criterion | Status |
|----|-----------|--------|
| AC-01 | Dashboard renders at `/admin` without console errors | ✅ |
| AC-02 | All 35 admin routes compile & generate statically | ✅ |
| AC-03 | Dark mode default, toggle works, no flash | ✅ |
| AC-04 | Sidebar gradient visible in light & dark | ✅ |
| AC-05 | Header uses glassmorphism, solid fallback on reduced transparency | ✅ |
| AC-06 | Module cards solid, hover lift + shadow, focus ring | ✅ |
| AC-07 | Stat numbers use Bebas Neue + tabular-nums | ✅ |
| AC-08 | Body text uses Lato (font-body) | ✅ |
| AC-09 | Empty state shows when user has zero module access | ✅ |
| AC-10 | `npm run build` passes (TypeScript + Next.js) | ✅ |
| AC-11 | `npm run lint` passes (0 errors) | ✅ |
| AC-12 | Mobile (375px) → Desktop (1440px) responsive | ✅ |

---

## 9. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Font loading flash (FOUT) | Low | Medium | `display: swap`, preload via `next/font` |
| Glassmorphism perf on low-end mobile | Medium | Low | `@media (max-width: 767px)` reduces blur to 12px |
| Reduced transparency not respected | Low | High | Global fallback in `globals.css` + local `motion-safe:` |
| Permission filtering breaks module grid | Low | High | Existing `hasAnyPermission` logic unchanged |

---

## 10. Rollout Plan

| Phase | Action | Owner |
|-------|--------|-------|
| **Done** | Code complete, build & lint pass | Dev |
| **Done** | Design system docs referenced | Dev |
| **Next** | Deploy to staging, UAT with admin users | PM + QA |
| **Next** | Collect feedback, iterate empty state copy | PM + Design |
| **Future** | Extend empty states to all admin list pages (Content, Falak, Program, etc.) | Dev |

---

## 11. Appendix

### 11.1 Related Documents
- `PRODUCT.md` — Product context & brand commitments
- `docs/07-specifications/dashboard-spec.md` — Technical spec (existing)
- `docs/08-design-system/README.md` — Design system overview

### 11.2 Changelog
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-29 | AI Assistant | Initial PRD documenting completed refactor |

---

## 12. Sign-off

| Role | Name | Status |
|------|------|--------|
| Product Owner | - | Pending |
| Tech Lead | - | Pending |
| Design Lead | - | Pending |
| QA Lead | - | Pending |

> **Note:** This PRD documents work **already completed**. It serves as a record of decisions, scope, and acceptance criteria for future reference and audits.