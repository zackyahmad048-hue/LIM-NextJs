# PRD: LIM Digital Platform — Public Website Rebuild

**Project:** LIM Digital Platform
**Document:** `prd-public-website.md`
**Version:** 1.0
**Status:** **Approved — Visual Direction Locked** ✅
**Date:** 2026-08-29

---

## 1. Executive Summary

### 1.1 Problem Statement
Situs publik LIM saat ini memiliki tampilan yang dinilai pemilik produk "jelek banget" — inkonsisten, tidak memantulkan wibawa Pesantren Lirboyo, dan menggunakan visual language yang generik. Rebuild total didorong menuju dunia visual "Khusyu Minimalis" yang kini diimplementasikan (lihat `DESIGN.md`); arah desain transisi sebelumnya dicabut karena dinilai AI-generated tanpa dasar kuat.

### 1.2 Solution
**Total rebuild dari nol** untuk seluruh situs publik (`app/(public)/`) dengan:
- **Dunia visual baru**: Dark mode sebagai basis, *keserasian warna* sebagai prinsip utama (belum ada nama tema, palet & tipografi definitif)
- **IA & navigasi dipertahankan**: 5 menu utama + struktur Profil dropdown
- **Mobile-first, dual-mode (default dark), hamburger nav** — keputusan fungsional tetap
- **Code-led build**: Tanpa image generation, ambisi tertulis dalam direction contract

### 1.3 Success Metrics
| Metric | Target |
|--------|--------|
| **Credibility perception** | Jamaah & donatur menganggap situs kredibel, terawat, berwibawa |
| **Task completion** | Jamaah menemukan jadwal shalat/kiblat/kalender < 10 detik |
| **Performance** | LCP < 2.5s, CLS < 0.1, TBT < 200ms (mobile 3G) |
| **Accessibility** | WCAG 2.1 AA semua halaman, dual-mode |
| **Build quality** | TypeScript strict, ESLint 0 errors, Next.js 16 App Router |

---

## 2. Product Context

### 2.1 Target Audiences (Public)
| Audience | Primary Goals | Key Pages |
|----------|---------------|-----------|
| **Masyarakat umum** | Baca artikel, lihat media, jadwal kegiatan | Beranda, Artikel, Media, Kontak | Jadwal shalat, kiblat, kalender Hijriah, hisab/rukyat, gerhana | Layanan Falak (6 sub-pages) | 
| **Kolaborator & Kepengurusan** | Evaluasi kredibilitas LIM | Profil (Tentang, Visi-Misi, Pengurus, Bidang) |
| **Kepengurusan & Internal** | Cari program, pendaftaran, info cabang | Profil → Bidang (8 sub-bidang) |

### 2.2 Brand Identity
- **Nama**: Lembaga Ittihadul Muballighin (LIM)
- **Tagline**: "Memasyarakatkan Pesantren, Memesantrenkan Masyarakat"
- **Asal**: Pondok Pesantren Lirboyo, Kediri, Jawa Timur
- **Diferensiasi**: portal dakwah generik

### 2.3 Product Principles (Non-Negotiable)
1. **Wibawa dari konten & keterampilan**, bukan ornamen
2. **Layanan falak = bukti keahlian nyata**, bukan widget generik
3. **Mobile-first**: Layout mulai dari layar kecil; desktop = perpanjangan
4. **Dual-mode default dark**: Kontras & keterbacaan terjaga kedua mode
5. **Budaya Nusantara/pesantran** = rumah visual sah — *tanpa stereotip dekoratif*

---

## 3. Scope

### 3.1 In Scope — Public Website Rebuild
| Area | Pages / Routes | Notes |
|------|----------------|-------|
| **Beranda** | `/` | Hero, statistik hero, CTA falak, peta dakwah, latest articles/media |
| **Profil** | `/profil/tentang`, `/profil/visi-misi`, `/profil/pengurus-pusat`, `/profil/bidang/*` | 8 bidang + Tim Wajib Khidmah + Permohonan |
| **Artikel** | `/artikel`, `/artikel/[slug]` | CMS-driven, kategori, pagination |
| **Media** | `/media` | Gallery (foto/video), filter kategori |
| **Kontak** | `/kontak` | Form, lokasi, info sekretariat |
| **Layanan Falak** | `/falak/jadwal-shalat`, `/falak/kiblat`, `/falak/kalender-hijriah`, `/falak/hisab`, `/falak/rukyat`, `/falak/gerhana` | 6 sub-pages, data real-time |
| **Wajib Khidmah** | `/wajib-khidmah/permohonan` | Form pendaftaran |

**Navigation IA (dipertahankan — lihat `docs/08-design-system/navigation.md`):**
```
Beranda | Profil ▼ | Artikel | Media | Kontak
  Profil ▼
    ├── Tentang LIM
    ├── Visi & Misi
    ├── Pengurus Pusat
    └── Bidang → 8 sub-items (+ Permohonan on TWK)
```

### 3.2 Out of Scope
- Admin CMS (`/admin/*`) — separate, not rebuilt
- Backend API / database schema changes (existing CMS feeds public)
- Authentication / user accounts (public is read-only)
- Image generation / AI assets — not available
- Copywriting — owner writes later

---

## 4. Functional Requirements

### 4.1 Beranda (`/`)
| Section | Requirement |
|---------|-------------|
| **Hero** | Foto `iksadari.JPG` + headline (moto oranye+slate) + deskripsi + CTA utama (falak) + widget jadwal shalat (kanan) + statistik hero (3 numbers: 100+ wilayah, 3000+ delegasi, 1000+ titik). Layout 2 kolom di desktop (kiri: teks, kanan: widget). Tanpa eyebrow/tagline terpisah. Transisi entri mengikuti referensi DIGDAYA (`Reveal distance 80px` + `scale 0.9`, `EASE_OUT`). |
| **CTA Falak Prominent** | Quick access: Jadwal Shalat, Kiblat, Kalender — sticky di mobile |
| **Latest Articles** | 3-4 latest, card grid, link ke `/artikel` |
| **Latest Media** | 4-6 thumbnails, link ke `/media` |
| **Peta Dakwah** | Visualisasi 100+ wilayah (SVG/Canvas, not map lib) |
| **Footer** | Navigasi lengkap, logo, sosial, copyright |

**Tata Kelola Beranda (CMS):** setiap section beranda dikelola lewat CMS tanpa menyentuh kode. Titik masuk tunggal: *Dashboard → Beranda → Tata Kelola* (`/admin/homepage`). Sumber data per section:

| Section | Sumber data | Editor |
|---------|-------------|--------|
| Hero | Setting `homepage.hero` (fallback `config/hero.ts`) | `/admin/homepage/hero` |
| Peta Dakwah (Jaringan Dakwah) | Setting `homepage.route-map` (fallback `config/home.ts`) | `/admin/homepage/route-map` |
| Grid Berita & Artikel | Setting `homepage.home-grids` (fallback `config/home.ts`) | `/admin/homepage/grids` |
| Media Terbaru | Setting `homepage.latest-media` (fallback `config/home.ts`) + item media CMS | `/admin/homepage/media` |
| Tentang Kami | Site page `homepage.about` | `/admin/content/pages/homepage.about` |

Jika suatu setting belum tersimpan, section memakai nilai default dari kode; begitu diedit dan disimpan, nilai tersimpan menimpa default. Halaman *Tata Kelola* menandai status tiap section (tersimpan vs bawaan kode).

### 4.2 Profil Section
| Page | Content |
|------|---------|
| `/profil/tentang` | Sejarah LIM, Lirboyo, struktur organisasi |
| `/profil/visi-misi` | Visi (1), Misi (bullet list) |
| `/profil/pengurus-pusat` | Grid cards: foto, nama, jabatan, periode |
| `/profil/bidang/[slug]` | 8 bidang: deskripsi, program, galeri, kontak person |
| `/wajib-khidmah/permohonan` | Form multi-step: data diri, bidang, upload dokumen |

### 4.3 Artikel & Media
| Feature | Spec |
|---------|------|
| **Listing** | Infinite scroll / load more, filter kategori, search |
| **Detail** | Hero image, tanggal Masehi + Hijriah, author, share, related articles |
| **Media Gallery** | Masonry grid, lightbox, filter: Foto / Video / Infografis |

### 4.4 Layanan Falak (6 Pages — Core Differentiator)
| Page | Function | Data Source |
|------|----------|-------------|
| **Jadwal Shalat** | Kota picker → 5 waktu + imsak + terbit + dhuha + isya | API `/api/v1/falak/prayer-times` |
| **Arah Kiblat** | Geolocation + manual kota → derajat + kompas visual | API `/api/v1/falak/qibla` |
| **Kalender Hijriah** | Bulan/tahun picker → tabel 30 hari + tanggal Masehi | API `/api/v1/falak/hijri-calendar` |
| **Hisab** | Perhitungan hilal, criteria, hasil bulan ini | API `/api/v1/falak/hisab` |
| **Rukyat** | Laporan rukyat per wilayah, testimoni saksi | API `/api/v1/falak/rukyat` |
| **Gerhana** | Jadwal gerhana matahari/bulan, visibilitas Indonesia | API `/api/v1/falak/eclipse` |

**Falak UX Rules:**
- Default lokasi: **Kediri, Jawa Timur** (markaz LIM)
- Tampilkan **metode hisab Lirboyo** (bukan Kemenag generic)
- Semua angka: **tabular-nums**, font data (monospace)
- Tanggal: **Dual Gregorian + Hijriah** selalu berdampingan

### 4.5 Global Components
| Component | Spec |
|-----------|------|
| **Navbar** | Desktop: sticky, glass capsule → full-width on scroll; Mobile: Sheet (shadcn) from right |
| **Footer** | 4 kolom desktop, stacked mobile; logo, nav, kontak, sosial |
| **Theme Toggle** | Light / Dark / System — persist di localStorage |
| **Breadcrumb** | Di artikel & detail pages |
| **Search** | Global search (Cmd+K) — artikel |

---

## 5. Non-Functional Requirements

| Category | Requirement | Validation |
|----------|-------------|------------|
| **Performance** | LCP < 2.5s (mobile 3G), Next/Image for all images, font `display: swap` | Lighthouse CI |
| **Accessibility** | WCAG 2.1 AA, semantic HTML, focus visible, keyboard nav, screen reader | axe-core + manual |
| **Responsive** | 320px - 1536px+; 1 col mobile → 2 tablet → 3-4 desktop | Tailwind breakpoints |
| **SEO** | Meta tags, Open Graph, JSON-LD (Article, Organization, Event), sitemap.xml | Next.js Metadata API |
| **Internationalization** | Bahasa Indonesia only; date format ID + Hijriah | `intl` / custom |
| **Analytics** | Plausible / GA4 ready (event names defined) | Data layer |

---

## 6. Visual Direction — **CONFIRMED / LOCKED**

> ✅ **Decisions finalized via stakeholder interview (2026-08-29)**. All visual direction locked below.

### 6.1 Locked Decisions
| Decision | Value | Rationale |
|----------|-------|-----------|
| **Theme Name / Concept** | **"Sampaikan dariku walau satu ayat"** | Hadis sebagai landasan: penyampaian pesan (ayat/dakwah) di atas ornamen; keterbacaan & kejelasan absolut |
| **Primary Color** | **Oranye LIM (legacy)** — dari `/public/images/orangelim.png` & `logo.png` | Konsisten dengan CMS & aset existing; aksen taktis saja (CTA, status aktif, underline menu) |
| **Typography Direction** | **Sans Display + Sans Body (Modern)** | Tegas, kontemporer, keterbacaan tinggi; tidak "kitab" dekoratif |
| **Font Families** | Heading: **Bebas Neue** (uppercase, large, bold) — Body: **Lato** (clean, humanist) — Data: **JetBrains Mono** (presisi falak) — Arab: **Reem Kufi** | Semua `next/font/google`, variable, `display: swap`; Bebas = impact; Lato = readability; JetBrains = technical precision; Reem Kufi = Kufi modern legible |
| **Visual Metaphor** | **Khusyu Minimalis** (Ruang Khusyuk Minimalis) | Whitespace maximal, satu fokus per layar, tipografi besar, oranye hanya penanda aksi, solid flat, border tipis (`border-white/10` dark / `border-slate-200` light), **no drop shadow**, `rounded-sm`/`rounded-md`, glassmorphism **hanya navbar** |
| **Hero Treatment** | **Tipografi besar + foto `iksadari.JPG` subtle** | Foto sebagai atmosphere, bukan hero visual; headline Bebas Neue uppercase dominan dua baris (baris 1 oranye = "Memasyarakatkan Pesantren,", baris 2 slate/dark = "Memesantrenkan Masyarakat"); CTA oranye jelas; widget jadwal shalat di kolom kanan |
| **Falak Visual Language** | **Instrumental / Teknis Jujur** | Monospace numbers, grid presisi, indikator status, kompas visual — fungsional, tidak ceremonial |

### 6.2 Khusyu Minimalis — Visual Rules (Binding)
| Rule | Spec |
|------|------|
| **Canvas** | Slate-950 (dark default) / Slate-50 (light); grayscale spectrum |
| **Layout** | Mobile-first; editorial grid; generous whitespace; single focus per viewport |
| **Surfaces** | Flat solid (`bg-card` / `bg-background`); **no shadow**; border `1px` `border-white/10` (dark) / `border-slate-200` (light) |
| **Radius** | `rounded-sm` (4px) / `rounded-md` (6px) max; no `rounded-xl`/`2xl` |
| **Color Usage** | Orange **only** for: primary CTA, active nav underline, active status badge, focus ring; never as background wash |
| **Glassmorphism** | **Navbar only** — `backdrop-blur` + subtle border; `prefers-reduced-transparency` → solid |
| **Typography** | Bebas Neue uppercase for headings/hero numbers; Lato body; JetBrains Mono all data/falak; Reem Kufi Arabic |
| **Motion** | `EASE_OUT` (cubic-bezier 0.23,1,0.32,1) ≤300ms; entrance `Reveal` 600ms; `prefers-reduced-motion` respected |
| **Falak Pages** | Instrumental aesthetic: monospace tables, grid cards, status pills, compass SVG, dual Gregorian/Hijriah dates |

### 6.2 Constraints from Design System (`docs/08-design-system/`)
- **Tokens only** — no hardcoded colors (`bg-primary`, `text-foreground`, `border-border`)
- **shadcn/ui** primitives as base
- **Glassmorphism** only on chrome (navbar) + stat cards — *not* on content areas (WCAG)
- **Motion**: `EASE_OUT` (cubic-bezier 0.23,1,0.32,1) for entrance/hover; reduced-motion mandatory
- **Typography scale**: Display, H1-H6, Body Lg/Base/Sm, Caption, Label, Button
- **Spacing**: Tailwind scale, consistent rhythm

### 6.3 Assets Available
- `/public/images/logo.png` — logo utama
- `/public/images/orangelim.png` — logo varian oranye
- `/public/images/iksadari.JPG` — foto hero (Lirboyo atmosphere)

---

## 7. Technical Architecture

### 7.1 Stack
- **Framework**: Next.js 16 (App Router, RSC by default)
- **Styling**: Tailwind CSS v4 + CSS variables (design tokens)
- **Database**: Prisma 7 → PostgreSQL (Neon) — read-only for public
- **Auth**: Better Auth (admin only; public no auth)
- **CMS**: Existing admin CMS feeds content via API
- **Fonts**: `next/font/google` (variable fonts, preload, `display: swap`)

### 7.2 Route Structure (`app/(public)/`)
```
app/(public)/
├── layout.tsx          # Root layout: providers, navbar, footer, fonts
├── page.tsx            # Beranda
├── profil/
│   ├── tentang/page.tsx
│   ├── visi-misi/page.tsx
│   ├── pengurus-pusat/page.tsx
│   └── bidang/
│       ├── [slug]/page.tsx
│       └── tim-wajib-khidmah/permohonan/page.tsx
│   
├── artikel/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── media/page.tsx
├── kontak/page.tsx
└── wajib-khidmah/permohonan/page.tsx
```

### 7.3 Data Fetching
- **Server Components** by default (RSC)
- **Client Components** only for: theme toggle, mobile nav, falak interactive (kompas, kota picker), search, forms
- **ISR / Revalidate**: 1 hour for CMS content; 5 min for falak real-time
- **No client-side data fetching** for static content

### 7.4 Component Architecture
```
components/website/
├── layout/
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── theme-toggle.tsx
├── motion/
│   ├── reveal.tsx          # Entrance primitive
│   └── hover.ts            # Hover lift
├── falak/
│   ├── prayer-times.tsx
│   ├── qibla-compass.tsx
│   ├── hijri-calendar.tsx
│   └── ...
├── ui/
│   ├── article-card.tsx
│   ├── media-card.tsx
│   ├── stat-card.tsx       # Hero numbers
│   └── ...
└── sections/
    ├── hero.tsx
    ├── latest-articles.tsx
    ├── latest-media.tsx
    └── dakwah-map.tsx
```

---

## 8. Design System Integration

### 8.1 Tokens to Define (in `globals.css` / `theme.md`)
| Token Category | Examples |
|----------------|----------|
| **Color** | `--primary`, `--secondary`, `--background`, `--foreground`, `--muted`, `--accent`, `--card`, `--border`, `--ring` |
| **Semantic** | `--success`, `--warning`, `--error`, `--info` |
| **Glass** | `--glass-chrome-bg`, `--glass-card-bg`, `--glass-border`, `--glass-blur`, `--glass-saturate`, `--glass-highlight` |
| **Typography** | `--font-heading`, `--font-body`, `--font-data`, `--font-ar` |
| **Radius** | `--radius` → `sm` `md` `lg` `xl` `2xl` `3xl` `4xl` |
| **Spacing** | Tailwind scale (4px base) |
| **Shadow** | `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl` |

### 8.2 Public vs Admin Token Namespace
| Scope | Prefix | Example |
|-------|--------|---------|
| **Public** | (none) | `--background`, `--primary`, `--font-heading` |
| **Admin** | `admin-` | `--admin-content-bg`, `--admin-card-border`, `--admin-sidebar-bg` |

> Public tokens **tidak** menggunakan prefix `admin-`. Admin tokens tetap terpisah.

---

## 9. Acceptance Criteria

| ID | Criterion | Priority |
|----|-----------|----------|
| **AC-01** | All 15 public routes render without console errors | P0 |
| **AC-02** | Dark mode default, toggle works, no flash (SSR) | P0 |
| **AC-03** | Mobile hamburger nav (Sheet) opens/closes correctly | P0 |
| **AC-04** | Navbar glass capsule → full-width on scroll (desktop) | P0 |
| **AC-05** | Falak pages: real data, dual date, tabular nums, Kediri default | P0 |
| **AC-06** | WCAG 2.1 AA contrast both modes; keyboard nav all interactive | P0 |
| **AC-07** | LCP < 2.5s mobile 3G; CLS < 0.1 | P1 |
| **AC-08** | SEO: meta tags, OG, JSON-LD, sitemap.xml, robots.txt | P1 |
| **AC-09** | Font loading: no layout shift, `display: swap`, preload | P1 |
| **AC-10** | `npm run build` passes (TypeScript + Next.js + Prisma generate) | P0 |
| **AC-11** | `npm run lint` passes (0 errors) | P0 |
| **AC-12** | Design tokens used everywhere — zero hardcoded colors | P1 |

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Visual direction undecided** | High | Blocks all UI work | Timebox decision (1 week); run `shape` workshop with owner |
| **Falak calculation accuracy** | Medium | Credibility loss | Use existing API (battle-tested); display method citation |
| **Font performance (multiple families)** | Medium | CLS/LCP | `next/font` preload; limit to 3 families max; `font-display: swap` |
| **Glassmorphism perf on low-end** | Medium | Jank | `@media (max-width: 767px)` blur 12px; `prefers-reduced-transparency` fallback |
| **CMS content not ready** | High | Empty pages | Design empty states first; use skeleton loading |
| **Arabic text rendering (Reem Kufi)** | Low | Layout break | Test `dir="rtl"` segments; line-height safety |
| **Image optimization (hero photo)** | Medium | LCP | `next/image` with `priority`, `sizes`, WebP/AVIF |

---

## 11. Rollout Plan

| Phase | Duration | Deliverables | Owner |
|-------|----------|--------------|-------|
| **0. Direction Lock** | 1 wk | Theme name, palette, typography, metaphor approved | PO + Design |
| **1. Shape / Design** | 1-2 wk | `DESIGN.md`, component specs, page wireframes, motion spec | Design + Dev |
| **2. Foundation** | 1 wk | Tokens, globals.css, font loading, layout.tsx, navbar, footer | Dev |
| **3. Core Pages** | 2 wk | Beranda, Profil (4), Artikel list/detail, Media, Kontak | Dev |
| **4. Falak Suite** | 2 wk | 6 falak pages + interactive components (kompas, picker) | Dev |
| **5. Wajib Khidmah** | 3 days | Form multi-step + validation + submission | Dev |
| **6. Polish & Harden** | 1 wk | Empty states, error states, a11y audit, performance, SEO | Dev + QA |
| **7. Staging UAT** | 1 wk | Owner review, copy input, bug bash | PO + Team |
| **8. Production Deploy** | - | Vercel/Production, monitoring | DevOps |

---

## 12. Dependencies

| Dependency | Status | Notes |
|------------|--------|-------|
| **Visual direction approval** | ❌ Blocking | Must complete before Phase 1 |
| **CMS content populated** | ⚠️ Partial | Articles, media, profil content needed for realistic review |
| **Falak API stable** | ✅ Done | `/api/v1/falak/*` endpoints exist |
| **Assets optimized** | ⚠️ Pending | `iksadari.JPG` → WebP/AVIF, multiple sizes |
| **Analytics events defined** | ❌ Open | Define event taxonomy before Phase 3 |

---

## 13. Appendix

### 13.1 Related Documents
- `PRODUCT.md` — Source of truth (this PRD derives from it)
- `docs/08-design-system/navigation.md` — IA & nav behavior (binding)
- `docs/08-design-system/*.md` — Design system standards (binding)
- `docs/07-specifications/cms-spec.md` — CMS that feeds public content
- `docs/07-specifications/falak-spec.md` — Falak domain logic
- `docs/05-decisions/*.md` — ADRs (architecture decisions)

### 13.2 Changelog
| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-29 | AI Assistant | Initial PRD for public website rebuild |

### 13.3 Sign-off — **COMPLETED**
| Role | Name | Status |
|------|------|--------|
| Product Owner | — | ✅ Approved (visual direction locked) |
| Design Lead | — | ✅ Approved (Khusyu Minimalis confirmed) |
| Tech Lead | — | ✅ Ready for implementation |

*Visual direction confirmed via structured interview 2026-08-29. All 6 decisions locked.*

---

## 14. Next Immediate Action

> **Run `$impeccable shape`** — visual direction **APPROVED**. This will:
> 1. Define the visual world in `DESIGN.md` (tokens, components, page specs)
> 2. Specify component designs per page (Beranda, Profil, Artikel, Media, Falak, etc.)
> 3. Lock tokens in `globals.css` (colors, typography, radius, shadows, glass)
> 4. Create direction contract for code-led build

**Ready for `shape` phase. Do not start implementation until `DESIGN.md` exists and is approved.**