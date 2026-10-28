# DESIGN.md — Visual World: Khusyu Minimalis (Public Website)

**Project:** LIM Digital Platform — Public Website (`app/(public)/`)
**Direction:** "Sampaikan dariku walau satu ayat" — Khusyu Minimalis
**Status:** Implemented · **Revisi:** 2026-10-09 (sinkron dengan `app/globals.css` dan `docs/08-design-system/`)

Sumber kebenaran token adalah `app/globals.css`. Dokumen ini tidak boleh menyebut nilai warna atau radius yang bertentangan dengannya. Rincian per topik ada di `docs/08-design-system/` (lihat bagian 10).

## 1. Concept
Khusyu Minimalis: tempat ibadah yang fokus dan tenang. Pesan disampaikan **walau tanpa** ornamen, bukan **dengan** ornamen. Whitespace maksimal, satu fokus per viewport, dan otoritas lembaga ditunjukkan lewat kemampuan nyata (hisab falak langsung), bukan dekorasi.

## 2. Design Decisions

| Aspek | Keputusan | Catatan |
|---|---|---|
| Canvas | Siang: kertas hangat (`--background` ≈ `oklch(0.985 0.004 80)`). Malam: indigo gelap (`--background` ≈ `oklch(0.155 0.02 260)`). **Default: malam** (`defaultTheme="dark"`) | Token `--background`, `--foreground`, `--card`, `--border`. Bukan putih klinis atau hitam netral |
| Primary | Oranye LIM, aksen taktis (`--primary` ≈ `oklch(0.45 0.195 38.4)` siang, `oklch(0.47 0.157 37.3)` malam) | CTA, status aktif, pill nav aktif, focus ring. Bukan latar kartu |
| Fonts | Fraunces (heading) · Inter (body) · JetBrains Mono (data/falak) · Reem Kufi (Arab) | `next/font/google`, `display: swap` |
| Chrome | Solid: navbar/topbar/rail memakai `bg-background`, tanpa blur | |
| Konten | Kartu/widget highlight memakai `.glass`; tabel, form, teks panjang solid (`bg-card` + border) | Varian tint modul: `.glass-tint-{falak\|program\|sekretariat\|konten\|sistem}` |
| Ambient | Lapisan `.ambient` (orb + grid) di belakang halaman bergaya kaca | Syarat agar glass punya sesuatu untuk diburamkan |
| Shadow | Lembut, kertas tertumpuk: `shadow-sm` / `shadow-md` (token `--lim-shadow-*`) | Tanpa halo atau shadow keras |
| Radius | Berbasis `--radius` (saat ini `0.75rem`), skala `rounded-sm … rounded-2xl` | Versi fluid masih **usulan**, lihat bagian 6 dan 10.4 |
| Motion | Token `lib/ease.ts` (`EASE_OUT`); hover ≤300ms; entrance `Reveal` 600ms; `prefers-reduced-motion` dihormati | Tanpa translate-lift pada kartu (diganti border-color) |
| Falak | Instrumental dan jujur | Monospace, tabular-nums, grid, status pill, Gregorian + Hijriah, default Kediri |

## 3. Typography

| Peran | Family | Sumber |
|---|---|---|
| Heading | Fraunces (variable, serif editorial, SOFT=30 WONK=0) | `app/layout.tsx` |
| Body | Inter | `app/layout.tsx` |
| Data / Falak | JetBrains Mono (`--font-data`, utility `font-data`) | `app/layout.tsx` |
| Arab | Reem Kufi (`--fx-ar`) | `app/layout.tsx` |

`@theme inline` memetakan `--font-heading` / `--font-display` ke Fraunces dan `--font-mono` / `--font-data` ke JetBrains Mono. `.site h1..h4` memakai title case dengan `text-wrap: balance`; uppercase hanya untuk eyebrow dan label (`uppercase text-xs tracking-widest text-muted-foreground`, bukan serif). Berat font ditentukan per komponen (hero bold, judul section semibold). Empat keluarga font adalah pengecualian resmi situs publik (lihat `typography.md`).

## 4. Layout & Navigation
- **Navbar:** sticky, kapsul solid (`rounded-full bg-background border border-border/40 shadow-sm`), melebar penuh (`w-full rounded-none`) saat scroll dengan `transition-[width,border-radius,box-shadow,border-color]` 300ms `ease-in-out`. Tanpa glass. Item aktif = pill `bg-primary/10 text-primary`. Mobile: Sheet dari kanan.
- **Footer:** band tint oranye `bg-primary/[0.08] dark:bg-primary/[0.12]` + `border-t border-primary/15` (region latar tersendiri, bukan slab oranye solid).
- **Section:** wrapper `SiteSection` (`mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:py-16`) adalah satu-satunya sumber ritme; jangan menulis ulang kelas container per halaman. Antar section di Beranda dipisah hairline `h-px bg-border/60` (`SectionDivider`).
- **Grid sub-content:** `gap-4 md:gap-6`, kartu `h-full`, jumlah kolom tidak dicampur dalam satu viewport.
- **IA (binding):** Beranda · Profil (dropdown: Tentang, Visi-Misi, Pengurus Pusat) · Bidang (top-level, `/profil/bidang`) · Artikel · Kontak. Falak diakses lewat widget shalat di hero; Media tidak ada di menu atas. Maksimal lima menu utama.

## 5. Page Designs

**Beranda (`/`)**
- **Hero:** foto `iksadari.JPG` full-bleed berintensitas rendah di belakang scrim vertikal (`from-background/70` → `to-background`); headline Fraunces dominan (judul + baris highlight oranye) di kiri, dua CTA di bawahnya (primer "Jadwal Shalat Hari Ini" → `/falak/jadwal-shalat`, sekunder outline), widget shalat (`PrayerScheduleWidget`) di kanan; tiga statistik (100+ wilayah, 3000+ delegasi, 1000+ titik) bertabular-nums di bawahnya.
- **Tentang:** konten `.glass` ringan dengan border.
- **Bidang:** carousel diskrit 8 kartu (judul + tagline), prev/next dapat diakses keyboard, tanpa auto-rotate.
- **Kajian & Artikel (Bento):** grid kiri 2 kartu, kanan 1 kartu besar (feature), bergaya `.glass` ringan.

**Profil:** `SiteSection`; kartu solid ber-border `border-border/60`; aksen oranye hanya taktis; tabel dan teks solid.

**Layanan Falak (6 halaman):** instrumental. Angka monospace tabular-nums, status badge, city picker, GPS, jam ganda (standar + istiwa), hitung mundur shalat berikutnya, kompas Kiblat SVG. Status aktif memakai border/ring oranye, bukan latar oranye.

**Artikel / Media / Kontak / Wajib Khidmah:** permukaan datar ber-border; empty state dashed border; form solid.

## 6. Component Contract

| Aturan | Penerapan |
|---|---|
| Shadow lembut | Kartu konten memakai `shadow-sm` / `shadow-md`; modal/popover `shadow-lg`; tanpa halo dan shadow keras |
| Chrome tanpa glass | Navbar publik, topbar/rail admin, dan back-link auth solid tanpa `backdrop-blur` |
| Glass hanya via `.glass` | Jangan menulis ulang `backdrop-blur-*` atau `bg-white/*`; maksimal dua lapis bertumpuk |
| Tanpa latar oranye pada kartu | Oranye = border, teks, ring. Pengecualian: band footer dan pill nav aktif (elemen kecil) |
| Border kartu | Default `border-border/60` (atau `--glass-border` pada `.glass`); hover/aktif → `border-primary`; lebar tidak berubah. Lihat 10.4 |
| Warna hanya dari token | Tanpa hex/rgb dan tanpa palette bawaan Tailwind |
| Skala radius | `rounded-xl` standar kartu konten (public dan admin); `rounded-md` input/tombol; `rounded-lg` form/panel kecil/nested; `rounded-sm` chip; `rounded-2xl` hanya hero overlay; navbar `rounded-full`. Modal/sheet: lihat 10.4 |
| Radius fluid (usulan) | `--radius: clamp(0.625rem, 0.25vw + 0.5rem, 1rem)` → ±10px mobile, ±12px desktop, maks 16px layar lebar; semua `rounded-*` ikut. Belum diterapkan di `globals.css` |
| Tanpa translate hover-lift | `hover:-translate-y-*` diganti perubahan border-color |
| Gradient | Hanya scrim hero dan lapisan `.ambient` |
| Heading | Fraunces title case; `tracking-*` + uppercase hanya untuk eyebrow/label |
| Aksesibilitas | `prefers-reduced-transparency` → kaca menjadi solid; `prefers-reduced-motion` → entrance mati, hover/transition tetap; kontras AA |

## 7. Anti-Goals
- Oranye sebagai latar kartu atau konten (pengecualian: band footer dan pill nav aktif).
- Shadow keras atau halo; hanya `shadow-sm` / `shadow-md` / `shadow-lg` lembut.
- Glassmorphism pada chrome (navbar, topbar, rail); chrome wajib solid.
- Radius di atas `rounded-xl` pada kartu konten.
- Ilustrasi dekoratif atau gradient di luar scrim hero dan `.ambient`.
- Heading sans-only; heading wajib serif editorial (Fraunces), body Inter.
- Band footer solid oranye; yang dipakai adalah tint 8-12%.
- Semua klise AI slop (glow neon, gradient ungu-biru, card dalam card, emoji sebagai ikon, copy dan statistik karangan; jangan mengarang klaim komersial, testimoni, atau studi kasus).

## 8. Validasi
Perintah lewat script proyek (lihat `AGENTS.md`): `npm run typecheck`, `npm run lint`, `npm run build`. Hasil terakhir tercatat 2026-08-30: lulus, 15 rute publik ter-compile. Jalankan ulang setelah perubahan `--radius` dan `.glass`. Uji tampilan di ±390px, ±1440px, dan ≥2560px, mode terang dan gelap.

## 9. Notes / Dead Code
- Tidak ada dead code dari arah desain sebelumnya: dihapus `components/website/sections/{route-map,latest-media,post-grid}.tsx`, `components/website/motion/hover.ts` (`cardLift`), dan tiga editor admin beserta halamannya (`admin/homepage/{route-map,grids,media}`).
- Dipertahankan karena masih dipakai: `components/website/taqwim/stat-rule.tsx` (hero stats), `components/website/taqwim/reveal.tsx` (entrance), dan `components/website/sections/{Hero,about,bidang-carousel,article-bento}.tsx`.
- Primitive shadcn `Card` berstandar `rounded-xl`, kini seragam untuk semua kartu konten, public dan admin; ini default yang disengaja, bukan override.
- Token dan helper chrome-glass dihapus (`--glass-chrome-bg`, `.glass-hard`, `glassChrome` / `glassCard`). `components/admin/shared/chrome.ts` kini mengekspor `chrome` (permukaan solid topbar). `backdrop-blur` dihapus dari navbar publik, topbar/rail admin, dan `app/(auth)/layout.tsx`.
- `--glass-highlight` sudah didefinisikan di `globals.css` tetapi belum dipakai oleh `.glass` (usulan: `box-shadow: var(--glass-highlight), var(--lim-shadow-md)`).

## 10. Keterkaitan dengan Design System (`docs/08-design-system/`)

### 10.1 Peta rujukan

| Topik | Dokumen | Cakupan |
|---|---|---|
| Prinsip & standar global | `README.md` | Mobile first, token, shadcn/ui, WCAG AA |
| Warna & token | `colors.md` | Struktur token, semantik, status; nilai aktual di `globals.css` |
| Tema, glass, shadow, radius | `theme.md` | Aturan "Kaca Kristal", token shadow, skala radius |
| Tipografi | `typography.md` | Empat peran font situs publik, hierarki heading |
| Layout & ritme section | `layout.md` | `SiteSection`, grid sejajar, widget responsive |
| Spacing | `spacing.md` | Skala Tailwind, spacing kartu dan komponen |
| Responsive | `responsive.md` | Breakpoint, perilaku per perangkat |
| Navigasi | `navigation.md` | IA, navbar kapsul, mobile Sheet, breadcrumb admin |
| Motion | `motion.md` | Token easing/spring, `Reveal`, reduced motion |
| Komponen & shell admin | `components.md` | Button, kartu, tabel, `Band`, `PageContainer`, dll. |
| Form, ikon, tabel, aksesibilitas | `forms.md`, `icons.md`, `tables.md`, `accessibility.md` | Standar masing-masing |

Area admin tidak dicakup dokumen ini; ia mengikuti `components.md` (Admin CMS Shell) dan `spec-admin-tenang-modern.md`.

### 10.2 Hierarki sumber kebenaran
Untuk situs publik: `PRODUCT.md` (maksud produk) → `DESIGN.md` (keputusan visual) → `app/globals.css` (nilai token) → dokumen di `docs/08-design-system/`. Jika isi dokumen lain bertentangan, tiga yang pertama berlaku (sesuai catatan di `README.md` design system).

### 10.3 Ketidaksesuaian docs yang perlu diperbarui
Diverifikasi terhadap `app/globals.css` dan isi repo per 2026-10-09.

| Dokumen | Isi saat ini | Kenyataan |
|---|---|---|
| `PRODUCT.md`, `colors.md` | `--primary` `oklch(0.553 0.195 38.402)`; `--background` putih `oklch(1 0 0)` / near-black `oklch(0.145 0 0)` | `--primary` `0.45` (siang) / `0.47` (malam); `--background` kertas hangat / indigo gelap. Nilai `0.553` kini hanya `--chart-4` |
| `theme.md` | `--glass-card-bg` ≈72% | 56% (siang) / 60% (malam) via `color-mix` |
| `motion.md` | Seksi "Hover Lift Kartu" (`hover.ts`, `cardLift`) | `hover.ts` sudah dihapus; hover = border-color |
| `motion.md` | Marquee auto-scroll di `bidang-carousel.tsx` | Carousel kini diskrit tanpa auto-rotate (keyframes `marquee*` masih ada di CSS) |
| `spacing.md`, `responsive.md` | Ritme section `py-16 sm:py-20` | `SiteSection` memakai `py-12 lg:py-16` (sesuai `layout.md`) |
| `spacing.md` | Navbar disebut "kapsul navbar glass" | Navbar solid |
| `navigation.md` | Daftar Public Navigation memuat Media; Bidang di bawah Profil; header versi 3.1 padahal changelog 3.2 | IA aktual: Bidang top-level, Media tidak di menu atas |

### 10.4 Keputusan terbuka
1. **Border kartu default.** `README.md` (design system) menyebut `border-primary/25`; seksi Profil dokumen ini menyebut `border-border/60`. Revisi ini memakai `border-border/60` (selaras token dan `.glass`); perlu konfirmasi, lalu samakan.
2. **Radius modal dan sheet.** `theme.md` mencadangkan `rounded-2xl`+ hanya untuk chrome dan hero overlay dan tidak mengatur modal/sheet. Perlu keputusan: ikut default shadcn atau `rounded-2xl`.
3. **`--radius` fluid.** Belum diterapkan (`globals.css` masih `0.75rem`). Bila disetujui, perbarui `theme.md` (tabel radius) dan bagian 2 dan 6 dokumen ini.