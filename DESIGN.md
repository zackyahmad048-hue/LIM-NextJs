# DESIGN.md — Visual World: Khusyu Minimalis (Public Website)

**Project:** LIM Digital Platform — Public Website (`app/(public)/`)
**Direction:** "Sampaikan dariku walau satu ayat" — **Khusyu Minimalis**
**Status:** Implemented
**Date:** 2026-08-30

---

## 1. Concept

**Khusyu Minimalis** — a place of focused, quiet worship. The message is carried
*despite* (not by) ornament. Whitespace is maximal, each viewport holds a single
focus, and the institution's authority is shown through demonstrated skill
(live falak reckoning) rather than decoration.

> "Sampaikan dariku walau satu ayat" — a hadis that grounds the whole system:
> delivery of the message over ornament.

## 2. Design Decisions

| Aspect | Decision | Notes |
|--------|----------|-------|
| **Canvas** | White `oklch(1 0 0)` (light) / near-black `oklch(0.145 0 0)` (dark); neutral grayscale | Token `--background`, `--foreground`, `--border` (definisi di `app/globals.css`) |
| **Primary** | Oranye LIM — tactical accent only | CTA, active nav underline, active status, focus ring. **Never a background wash** |
| **Fonts** | Fraunces (heading, serif editorial) · Inter (body) · JetBrains Mono (data/falak) · Reem Kufi (Arabic) | `next/font/google`, `display: swap` |
| **Surfaces** | **Chrome solid** — navbar/topbar/rail memakai permukaan `bg-background` (kertas, tanpa blur). **Konten** — widget/kartu highlight memakai glass `.glass` (kaca kristal), tabel/form/teks solid (`bg-card`+`border`); shadow lembut `shadow-sm`/`shadow-md` — kertas tertumpuk | Footer band tint oranye `primary/[8-12]%` |
| **Radius** | Content `rounded-xl` standard (chips/nested kecil `rounded-md`/`rounded-lg`); navbar chrome `rounded-full` (kapsul) | Radius seragam `rounded-xl` untuk semua content cards — public & admin |
| **Motion** | `EASE_OUT` ≤300ms hover · entrance `Reveal` 600ms · reduced-motion respected (entrance mati, hover/transition tetap) | No translate-lift on cards (replaced with border-color); navbar scroll `transition-[width,border-radius,box-shadow,border-color]` 300ms |
| **Falak** | Instrumental / honest | Monospace, tabular-nums, grid, status pills, dual Gregorian+Hijriah, Kediri default |

## 3. Typography

| Role | Family | Source |
|------|--------|--------|
| Heading | **Fraunces** (wght variable, serif editorial, SOFT=30 WONK=0) | `app/layout.tsx` |
| Body | **Inter** | `app/layout.tsx` |
| Data / Falak | **JetBrains Mono** (`--font-data`, `font-data` utility) | `app/layout.tsx` (added) |
| Arabic | **Reem Kufi** (`--fx-ar`) | `app/layout.tsx` |

- `@theme inline` maps `--font-heading`/`--font-display` → Fraunces, `--font-mono`/`--font-data` → JetBrains Mono.
- `.site h1..h4` are title case Fraunces serif with `text-wrap: balance`; uppercase is opt-in for eyebrows/labels only. Berat font dibiarkan per-komponen (hero bold, judul section semibold) — tidak dipaksa 500.

## 4. Layout & Navigation

- **Navbar**: sticky kapsul **solid** (`rounded-full`, `bg-background border border-border/40 shadow-sm`) → melebar penuh (`w-full rounded-none`) on scroll; transisi `transition-[width,border-radius,box-shadow,border-color]` 300ms `ease-in-out`. Chrome tidak memakai glass (kaca hanya untuk kartu/widget konten).
  Active items = **pill** `bg-primary/10 text-primary` (bukan underline). Mobile: Sheet dari kanan.
- **Footer**: band tint oranye `bg-primary/[0.08] dark:bg-primary/[0.12]` + `border-t border-primary/15` (prinsip permukaan 3-lapis Ant Design: footer = region latar tersendiri).
- **Beranda**: section dipisah hairline `h-px bg-border/60` dalam `max-w-6xl` (`SectionDivider`).
- **IA (binding)**: Beranda · Profil (dropdown: Tentang, Visi-Misi, Pengurus Pusat) · Bidang (top-level, `/profil/bidang`) · Artikel · Kontak. Falak diakses lewat widget shalat di hero; Media tidak di menu atas.

## 5. Page Designs

### Beranda (`/`)
1. **Hero** — full-bleed `iksadari.JPG` as subtle atmosphere at low opacity behind a
   soft vertical fade (`bg-gradient-to-b` via `from-background/70` → `to-background`),
   then a dominant Fraunces serif headline (title + orange highlight line) on the
   left, two **CTA buttons** (primary "Jadwal Shalat Hari Ini" → `/falak/jadwal-shalat` +
   secondary outline) below the headline, and the **shalat widget** (`PrayerScheduleWidget`)
   on the right; 3 hero stats (100+ wilayah, 3000+ delegasi, 1000+ titik) in tabular
   numbers below the fold.
2. **Tentang (About)** — konten glass ringan (`.glass`) dengan border; bukan kartu flat.
3. **Bidang carousel** — diskrit 8 kartu (judul + tagline) memakai `Carousel`; prev/next
   keyboard-accessible, tanpa auto-rotate.
4. **Kajian & Artikel (Bento)** — layout grid: kiri 2 kartu, kanan 1 kartu besar (feature),
   kartu bergaya glass ringan (`.glass`).

### Profil section
- Section wrapper `SiteSection` (`mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16`);
  kartu thin-border (`border-border/60`), aksen oranye hanya taktis; tabel/teks solid.

### Layanan Falak (6 pages)
- Instrumental: monospace numbers, tabular-nums, status badges, city picker,
  GPS, dual clock (standar + istiwa), next-prayer countdown, Kiblat compass SVG.
- All drop shadows and primary background washes removed; active states use
  orange **border/ring** accents.

### Artikel / Media / Kontak / Wajib Khidmah
- Flat bordered surfaces; empty states (dashed border); forms solid.

## 6. Component Contract

| Rule | Enforced |
|------|----------|
| Subtle soft shadow (not hard) | `shadow-sm`/`shadow-md` on content cards — kertas tertumpuk, bukan halo |
| No glass on chrome | Chrome (navbar publik, topbar/rail admin, back-link auth) memakai permukaan solid `bg-background`, tanpa `backdrop-blur`; glass hanya dipakai kartu/widget konten |
| No orange background wash | `bg-primary/10`, `bg-primary/5` removed from cards; orange → border/text/ring. Footer band tint (`primary/8-12%`) is the only filled surface |
| Cards use `border-primary/25` (1px) | Card border is hairlinel 1px tint; hover → `border-primary` (no width change) |
| Max radius `rounded-lg` (nested/small) · standard `rounded-xl` (content cards) | `rounded-2xl`+ reserved for navbar chrome only |
| No translate hover-lift | `hover:-translate-y-*` replaced with border-color change on hover |
| Gradient only on hero scrim | Subtle vertical fade behind hero photo (design intent) — no gradient elsewhere |
| Fraunces serif | Heading title case serif; `tracking-tight`/`tracking-*` + uppercase reserved for eyebrows/labels |

## 7. Anti-Goals (what is NOT allowed)

- Orange as a background wash on cards/content (footer tint band is the purposeful exception).
- Hard drop shadows (no blur offset, no halo) — hanya `shadow-sm`/`shadow-md` lembut.
- Glassmorphism pada chrome (navbar, topbar, rail) — chrome wajib solid; kaca hanya untuk kartu/widget konten.
- Radius above `rounded-xl` on content (navbar chrome `rounded-2xl` is the only exception).
- Decorative illustrations / gradient washes (hero scrim fade is the only gradient).
- Sans-only display faces — heading wajib serif editorial (Fraunces); body Inter.
- The retracted "Oranye band" footer is replaced by a subtle tint band (`primary/8-12%`), not a solid orange slab.

## 8. Validation

- `tsc --noEmit` — passes (NODE_OPTIONS `--max-old-space-size=4096` for heap).
- `eslint` on changed files — 0 errors.
- `npm run build` (prisma generate + next build) — passes; all 15 public routes compile.

## 9. Notes / Dead Code

- **Tidak ada** dead code tersisa dari arah desain sebelumnya — semua komponen terkait
  telah **dihapus**: `components/website/sections/{route-map,latest-media,post-grid}.tsx`
  (Jaringan Dakwah, Media Terbaru, Grid Berita), `components/website/motion/hover.ts`
  (`cardLift`), serta tiga editor admin dan halamannya
  (`admin/homepage/{route-map,grids,media}`).
- Yang **dipertahankan** karena masih dipakai: `components/website/taqwim/stat-rule.tsx`
  (hero stats), `components/website/taqwim/reveal.tsx` (entrance animation), dan
  `components/website/sections/{Hero,about,bidang-carousel,article-bento}.tsx`.
- The shared `Card` shadcn primitive defaults to `rounded-xl` — kini seragam sebagai standar untuk semua content cards, public & admin. Baris ini mencatat bahwa `rounded-xl` adalah default yang **disengaja**, bukan override.
- Token/lintasan chrome-glass **dihapus** (chrome kini solid): `--glass-chrome-bg`, `.glass-hard`, `glassChrome`/`glassCard`. `components/admin/shared/chrome.ts` kini mengekspor `chrome` (permukaan solid topbar). `backdrop-blur` dihapus dari navbar publik, topbar/rail admin, dan back-link `app/(auth)/layout.tsx`.
