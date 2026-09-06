# Transisi Tema dengan Swipe — Skiper UI (`skiper26`)

> **Status:** Active — supersedes the "swap" cross-fade described in `docs/08-design-system/motion.md` § "Transisi Tema (light ⇄ dark)".

Status: ready-for-agent

> **Triage state.** `ready-for-agent` — fully specified, ready for an AFK agent. No further triage needed.

## Problem Statement

Pergantian tema light ⇄ dark di LIM-NextJs memakai transisi "swap" **cross-fade** (fade-in/out overlay atau `startViewTransition` native). Pemilik menilai transisi ini kurang "hidup" dan tidak konsisten dengan arah desain Khusyu Minimalis yang kini menitikberatkan motion **bergerak mengikuti arah** (directional) pada chrome. Pemilik menginginkan transisi perpindahan tema yang terasa seperti **swipe vertikal** — layar digeser ke atas saat tema berganti — layaknya yang diperlihatkan di library Skiper UI (`@skiper-ui/skiper26`). Sebelumnya animasi swipe vertikal ini **belum diterapkan** pada toggle tema di navbar publik; toggle masih menggunakan transisi cross-fade lama.

Selain itu, dependency `framer-motion` belum tersedia (proyek memakai `motion/react`), dan konstanta easing eksponensial (`--expo-out`/`--expo-in`) yang direferensikan oleh keyframes transisi Skiper belum didefinisikan sehingga timing animation tidak sesuai library.

## Solution

Terapkan transisi perpindahan tema berbasis **Skiper UI `skiper26`** pada toggle tema navbar publik (`ThemeToggle`), dengan variant `rectangle` + start `bottom-up` sehingga terjadi **reveal vertikal (swipe ke atas)** memakai View Transitions API:

- Toggle tetap berwujud **pill switch** bundar (thumb Sun/Moon geser) yang telah disetujui pemilik.
- Klik toggle → memanggil `useThemeToggle` dari library → `document.startViewTransition()` menukar kelas tema dengan animasi clip-path `rectangle` dari bawah ke atas.
- Easing memakai `--expo-out`/`--expo-in` yang ditambahkan ke design token global.
- `prefers-reduced-motion` → perpindahan instan tanpa animasi (library menangani lewat fallback).
- Browser tanpa View Transitions API → fallback swap langsung.

## User Stories

1. As a visitor on the public site, I want the theme toggle in the navbar to remain a round pill switch with a sliding Sun/Moon thumb, so the control looks consistent with the Khusyu Minimalis design world.
2. As a visitor, I want toggling dark→light to animate as a vertical swipe revealing the light theme from the bottom, so the transition feels directional and alive.
3. As a visitor, I want toggling light→dark to animate as the same vertical swipe, so the motion is symmetric and predictable in both directions.
4. As a visitor using a browser with View Transitions API support, I want the swipe to use native view transitions, so the animation is smooth and performant.
5. As a visitor with `prefers-reduced-motion`, I want the theme change to happen instantly without animation, so I am not disturbed by motion.
6. As a visitor on a browser without View Transitions API support, I want the theme to still switch (degrading to an instant swap), so the control never feels broken.
7. As a visitor, I want the easing of the swipe to be smooth exponential-out, so the curtain accelerates then settles naturally.
8. As a visitor, I want the navbar layout not to shift while the toggle is hydrating, so the placeholder holds the same size as the mounted control.
9. As a developer, I want the theme transition logic to live in a single reusable seam (the theme toggle), so future theme transitions are easy to change or extend.
10. As a developer, I want the Skiper UI component to be vendored and lint-clean (no `setState` in effect, no unused vars), so the build passes ESLint without suppression.

## Implementation Decisions

- **Transisi tema** memakai `useThemeToggle` dari `@skiper-ui/skiper26` (komponen yang di-*vendor* ke `components/ui/skiper-ui/skiper26.tsx`), bukan transisi cross-fade lama. Pilihan variant **`rectangle`** + start **`bottom-up`** menghasilkan reveal clip-path dari bawah ke atas (swipe vertikal). Library menangani preferensi mode (dark vs light) dengan keyframes terpisah.
- **Toggle visual** (`components/theme-toggle.tsx`) tetap pill switch: pill `rounded-full`, ikon statis Moon (kanan) / Sun (kiri), thumb bundar `rounded-full` dengan `bg-card` yang bergeser via `motion/react` (translateX 0 ↔ 32px) mengikuti `isDark`. `isDark` diturunkan dari `resolvedTheme` agar selalu sinkron tanpa `useEffect` — menghilangkan lint `react-hooks/set-state-in-effect` pada hook library.
- **Dependency**: `framer-motion` ditambahkan ke `package.json` (dibutuhkan oleh komponen library yang mengimpor `motion` dari `framer-motion`). Proyek tetap memakai `motion/react` di kode aplikasi; keduanya berdampingan.
- **Design token**: konstanta easing `--expo-out` = `cubic-bezier(0.16, 1, 0.3, 1)` dan `--expo-in` = `cubic-bezier(0.7, 0, 0.84, 0)` ditambahkan pada `:root` di `app/globals.css`, karena keyframes yang dihasilkan library mereferensikan keduanya.
- **Hidrasi**: `ThemeToggle` memakai `useSyncExternalStore` untuk placeholder berukuran sama (`h-9 w-[4.25rem]`) sebelum mounted, agar navbar publik tidak bergeser — menggantikan placeholder bulat `h-9 w-9`.
- **Reduced motion**: hook library sudah menangani `document.startViewTransition`; aturan global `@media (prefers-reduced-motion: reduce)` di `app/globals.css` tetap menjadi safety net. Tidak ditambahkan animasi dekoratif baru pada toggle selain slide thumb yang sudah ada.
- **Aksesibilitas**: tombol memakai `role="switch"`, `aria-checked={isDark}`, dan `aria-label` dinamis ("Ganti tema ke terang/gelap").

## Testing Decisions

- Fitur ini adalah **UI visual** (transisi tema lewat View Transitions API) — sulit dan tidak dianjurkan untuk diuji sebagai unit test DOM karena bergantung pada API browser native (`document.startViewTransition`). Uji pada seam kontrak visual/docs, bukan pada implementasi.
- **Seam uji yang disarankan**: satu seam tinggi di `ThemeToggle` — perilaku eksternal yang layak diuji adalah (a) element toggler punya `role="switch"` dan `aria-checked` yang mencerminkan tema saat ini, (b) klik toggler memanggil handler yang menukar tema, (c) placeholder prä-mount berukuran sama dengan kontrol mounted (tidak menyebabkan layout shift).
- **Prior art**: tidak ada prior art test DOM untuk komponen website dalam repo ini; tests yang ada menargetkan logic murni (mis. `lib/astroCalc.prayer.test.ts`, `tests/geolocation.test.ts`). Karena itu, pengujian wajib dilakukan lewat validasi statis (typecheck, lint, build) dan tidak ditambahkan test unit untuk animasi.
- **Validasi disarankan**: `npm run typecheck` (perlu `NODE_OPTIONS=--max-old-space-size=4096` karena heap OOM di node_modules besar), `npm run lint` (0 error), `npm run build` (seluruh route ter-compile). Cek visual manual di browser untuk memastikan arah swipe dan easing terasa benar.

## Out of Scope

- Perubahan di luar toggle tema navbar publik: admin CMS tidak mendapat toggle tema (tidak ada theme toggle di admin).
- Mengganti library animasi atau menambah `framer-motion` di seluruh kode aplikasi (hanya dipakai oleh komponen Skiper yang di-vendor).
- Redesign visual pill toggle (thumb, warna, radius) selain yang sudah berlaku.
- Menambahkan gesture swipe jari/trackpad untuk berpindah tema (permintaan sebelumnya sudah diputuskan sebagai toggle pill + transisi slide layar, bukan gesture).
- Dukungan view-transition pada semua browser (fallback swap instan sudah dianggap cukup).

## Further Notes

- Komponen `skiper26.tsx` berisi kode demo (panel *Options*, teks lorem, Gfycat) yang tidak digunakan di aplikasi; hanya exports `useThemeToggle`, `ThemeToggleButton`, dan `createAnimation` yang relevan. Komponen demo tidak perlu dibersihkan dalam scope ini (sudah instaled dan lint-clean), tetapi boleh disederhanakan dalam pekerjaan terpisah.
- `docs/08-design-system/motion.md` § "Transisi Tema" perlu diperbarui agar tidak lagi menggambarkan cross-fade sebagai perilaku aktif (superseded oleh swipe vertikal). Ini DILUAR scope penulisan spec ini dan dilacak sebagai pekerjaan dokumentasi terpisah.
- Konvensi penamaan & terminology memakai glossari `CONTEXT.md`: toggle adalah komponen presentasi di layer website; tema diatur melalui provider `next-themes`.