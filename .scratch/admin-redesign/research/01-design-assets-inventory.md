# Research 01 — Inventaris aset desain yang mengatur permukaan admin

**Ticket:** `.scratch/admin-redesign/issues/01-design-assets-inventory.md`
**Branch:** `research/admin-design-assets`
**Tanggal:** 2026-09-06
**Metode:** Baca langsung tiap dokumen (bukan tebakan); kutipan mengikuti jalur file. Research-only — tidak ada kode yang diubah.

## Arah yang diuji

Arah "kurangi kartu": stat grid dibatasi/digabung, "daftar-dalam-kartu" pindah ke pola list divider-row (`border-t`/`divide-y`) yang sudah ada di repo, kartu dipertahankan hanya untuk tempat struktural (form, tabel), tetap dalam keluarga token yang ada (Fraunces/Inter, oklch oranye, `rounded-xl`, dark default).

Status per dokumen: **BENTROK** (mempreskripsikan kartu / menghambat arah) · **NETRAL** · **MENDUKUNG** (selaras dengan arah).

---

## A. `docs/08-design-system/*`

### 1. components.md — BENTROK (ringan) + 1 baris stale

- Aturan relevan:
  - §Cards: "Digunakan untuk: Dashboard Widget, Program, Article, **Statistics**, User Profile" — menormalisasi statistik sebagai kartu.
  - Admin CMS Shell: `SectionCard` ("Kartu section `rounded-2xl` + `border primary/25`"), `StatCard`/`MiniStat` ("dipakai saat statistik hidup **di dalam kartu lain**"), `PageContainer` (full-width), `chrome.ts` (`glassChrome`, `glassCard`, `softCard`).
- Status: **BENTROK** pada §Cards & StatCard/MiniStat (mempreskripsikan statistik berbentuk kartu dan MiniStat di dalam kartu). `PageContainer`/`chrome.ts` **MENDUKUNG** (mandiri full-width, token permukaan).
- Revisi minimum:
  - Tambah klausa bahwa primitif stat (StatCard/MiniStat) adalah kanvas surface-neutral — boleh dirender sebagai baris divider-row di atas kanvas, bukan wajib kartu.
  - §Cards: hilangkan "Statistics" dari daftar kegunaan kartu (atau tandai opsional/struktural).
- Baris stale: tabel `SectionCard` menyebut `rounded-2xl`, sedangkan kode (`components/admin/shared/section-card.tsx`) dan `theme.md` memakai `rounded-xl` (2xl dicadangkan chrome). Perbaiki ke `rounded-xl`.

### 2. theme.md — MENDUKUNG (netral-menuju-mendukung)

- Aturan relevan:
  - §Glassmorphism: kaca terbatas pada **chrome dan kartu**; tabel/form/teks panjang/area data padat **wajib solid**.
  - §Shadow: `shadow-md` standar kartu admin; `shadow-lg` modal/sheet.
  - §Radius: `rounded-xl` default semua content cards (public & admin); `rounded-2xl` hanya chrome.
- Status: **MENDUKUNG** untuk arah "kurangi kartu": memindahkan daftar keluar dari kartu = mengurangi permukaan kaca & shadow, konsisten dengan aturan "area data padat solid". Tokens tidak perlu berubah; berlaku untuk kartu yang tersisa (form/tabel).
- Revisi minimum: tidak ada revisi wajib. Opsional: kalimat "navbar (publik)... kartu dashboard" di daftar permukaan yang boleh kaca sebaiknya diberi catatan bahwa komposisi kartu/panggung direvisi oleh spec admin-redesign, sehingga contoh "kartu dashboard" bukan mandat.

### 3. layout.md — NETRAL + 1 drift kode-vs-dokumen

- Aturan relevan:
  - §Admin CMS: `PageContainer` **tanpa batas lebar**; padding horizontal ditangani `<main>` (`p-4 md:p-6 lg:p-8`); PageContainer hanya padding vertikal (`py-5 lg:py-8`). Form membatasi dirinya sendiri (mis. `max-w-2xl`).
  - §Grid: kolom 1/2/3-4 sesuai kebutuhan; grid sejajar (`gap-4 md:gap-6`, `h-full`) — contohnya di halaman publik/profil.
- Status: **NETRAL**. Container full-width justru ramah untuk list divider-row tanpa kartu.
- Revisi minimum: tidak ada untuk arah kartu.
- **Drift kode-vs-dokumen (call-out):** `app/(dashboard)/admin/layout.tsx:58-59` membungkus `<main>` dengan `max-w-7xl mx-auto`, padahal `layout.md` menyatakan konten admin "tanpa batas lebar" dan inset hanya dari `<main>`. Efektif saat ini konten dibatasi `max-w-7xl`. Bukan bentrok dengan arah kartu, tapi dokumen dan perilaku aktual tidak sinkron — perlu diselaraskan saat spec surface ditulis.

### 4. tables.md — MENDUKUNG

- Tabel tetap standar data baris-kolom besar (pagination server-side >50 baris, sorting, filter, empty state). Tidak ada aturan kartu.
- Status: **MENDUKUNG** — filosofi "baris" yang dikedepankan arah surface sama dengan arah tabel.
- Revisi minimum: tidak ada.

### 5. forms.md — MENDUKUNG

- Form standar (label di atas, group field, section untuk form panjang, validasi, states). Tidak membahas kartu.
- Status: **MENDUKUNG** — kartu tetap untuk form sesuai arah.
- Revisi minimum: tidak ada.

### 6. typography.md — MENDUKUNG (sumber font admin saat ini)

- Aturan relevan:
  - §Public (berlaku global): heading **Fraunces** (`--font-heading`), body **Inter** (`--font-body`), data JetBrains Mono, arab Reem Kufi. Catatan eksplisit: "tabel historis (Newsreader/Hanken/Spline, **Bebas Neue/Lato**, Space Grotesk) sudah diganti" — ini menegaskan font PRD lama (Bebas Neue/Lato) **telah disupersede**.
  - Hierarki H3 card `text-lg sm:text-xl font-semibold`; angka statistik `font-heading` + `tabular-nums`.
- Status: **MENDUKUNG** — arah surface memakai keluarga token yang sama; `.stat-number` di `globals.css` tetap berlaku untuk angka baris stat.
- Revisi minimum: tidak ada.

### 7. colors.md — MENDUKUNG (constraint)

- Aturan relevan: §Public — "**Admin CMS tidak termasuk rebuild dan tetap memakai identitas Oranye LIM**"; token tunggal `app/globals.css` (`--primary` oklch oranye). 
- Status: **MENDUKUNG** — arah surface berada dalam identitas yang sama; tidak menambah palet.
- Revisi minimum: tidak ada.

### 8. motion.md — NETRAL + 1 seksi disupersede (stale)

- Aturan relevan: easing/spring tokens; §Pola Transisi CMS (expand submenu sidebar, chrome token glass); reduced-motion wajib.
- Status: **NETRAL** — tidak ada aturan kartu; transisi chrome/rows tidak berubah.
- **Seksi stale:** §"Transisi Tema (light ⇄ dark)" masih menggambarkan cross-fade sebagai perilaku aktif. Per `.scratch/tema-swipe-skiper-ui/spec.md` (status **Active**), itu **disupersede** oleh swipe vertikal Skiper UI. Spec itu mencatat update motion.md sebagai pekerjaan dokumen terpisah — masih belum dilakukan.

### 9. navigation.md — NETRAL

- Aturan relevan: §Admin Navigation (sidebar), §Breadcrumb admin (`PageHeader` h1, tanpa h1 dobel). Tidak ada aturan kartu.
- Status: **NETRAL**.
- Revisi minimum: tidak ada.

### 10. accessibility.md — NETRAL (constraint)

- Aturan relevan: WCAG 2.1 AA, keyboard, focus, kontras, reduced-motion safety net. Tidak ada aturan kartu.
- Status: **NETRAL** — berlaku apa pun bentuk surface; baris/list divider-row tidak mengubah kewajiban a11y.
- Revisi minimum: tidak ada.

### 11. responsive.md — BENTROK (ringan, contoh implisit)

- Aturan relevan: §Grid Responsive "Dashboard Stats: `grid gap-3 md:grid-cols-2 xl:grid-cols-4`"; §"Dashboard Content: `grid gap-3 xl:grid-cols-[1fr_320px]`"; tabel Admin Dashboard Grid 1/2/4 kolom.
- Status: **BENTROK (ringan)** — contoh stat-grid mengasumsikan kartu stat sebagai norm; bila stat grid dibatasi dan daftar pindah ke divider-row, contoh ini jadi menyesatkan. Aturan responsif inti (mobile-first, no horizontal scroll) tetap **MENDUKUNG**.
- Revisi minimum: tambahkan catatan di §Grid bahwa contoh `grid-cols-4` untuk stat **contoh, bukan mandat**; stat boleh dirender sebagai baris divider-row; number of surfaces ditentukan spec admin-redesign.

### 12. spacing.md — MENDUKUNG + 1 baris stale + 1 contoh asumsi

- Aturan relevan: skala spacing Tailwind; §Card "`p-4` default, **`rounded-lg`**"; §Dashboards "stats grid `gap-3 md:grid-cols-2 xl:grid-cols-4`".
- Status: **MENDUKUNG** untuk aturan skala; **BENTROK (ringan)** untuk contoh stat-grid (sama seperti responsive.md).
- Baris stale: §Card menyebut `rounded-lg` default — **bertentangan dengan `theme.md` v1.1 (`rounded-xl` default content cards, public & admin)**. Perbaiki ke `rounded-xl`.
- Revisi minimum: catatan contoh grid stat (sama seperti responsive.md).

### 13. icons.md — NETRAL (punya kontradiksi internal, bukan surface)

- Aturan relevan: Lucide, ukuran konsisten, token warna. Tidak ada aturan kartu.
- Kontradiksi internal sudah ditandai di dokumen: tabel "Icon Colors" memakai Tailwind literal (`text-orange-500`, `text-emerald-600`) vs aturan "gunakan design tokens / jangan hardcode warna" — inkonsistensi yang sudah di-flag dalam dokumen; tidak terkait surface.
- Status: **NETRAL**. Revisi minimum: tidak terkait arah ini (perbaikan tabel warna dapat sebagai pekerjaan terpisah).

---

## B. `DESIGN.md` — MENDUKUNG (constraint token family)

- Klausa relevan: §2 Radii "seragam `rounded-xl` untuk semua content cards — **public & admin**"; §2 Fonts (Fraunces/Inter/JetBrains Mono/Reem Kufi); §2 Surfaces (solid flat, `border-primary/25`, shadow lembut, glass navbar-only). §7 Anti-goals ("Glassmorphism beyond navbar" — public scope).
- Status: **MENDUKUNG** — arah surface admin tetap dalam keluarga token yang sama (Fraunces/Inter, oklch oranye, rounded-xl, dark default), persis seperti klausa shared-token. Tidak ada konflik.
- Revisi minimum: tidak ada. Catatan: DESIGN.md berjudul "Public Website" tapi memuat pernyataan yang mengikat admin (radius/shared tokens) — ok selama admin surface system menjaga token sama.

---

## C. `docs/07-specifications/`

### 14. prd-admin-dashboard-refactor.md — BENTROK + stale (font & aturan kartu)

- Status dokumen: "Completed" (catatan §12 = rekaman pekerjaan yang **sudah selesai**).
- Aturan permukaan yang BENTROK dengan arah "kurangi kartu":
  - §4.1: **Welcome Card**, **Module Grid** (1→2→4 kolom solid cards), **Struktur & Anggota = 4 MiniStat cards**, Profil (Visi/Misi) di kartu.
  - §4.3: StatCard boleh glass; module cards & SectionCard solid.
  - AC-06: "Module cards solid, **hover lift** + shadow" — lift tidak terlihat di implementasi `section-card.tsx` sekarang (hover = border/shadow), dan `DESIGN.md` §6 melarang translate-lift untuk kartu.
  - §4.2: **Bebas Neue (heading) / Lato (body)** — font **telah disupersede** oleh Fraunces/Inter per `typography.md` (tabel historis menyebut Bebas Neue/Lato diganti) dan `globals.css`/`layout.tsx` (`--font-heading` = Fraunces).
- Status: **BENTROK** pada surface prescriptions (§4.1, §4.2 font, AC-06 hover lift) terhadap arah baru. Sebagai rekaman Completed, aturannya kini **inert** tapi tetap menyesatkan jika tidak ditandai.
- Revisi minimum:
  - §4.2 font: tandai superseded oleh `typography.md`/`globals.css` (Bebas Neue/Lato → Fraunces/Inter).
  - §4.1/AC-06: tambah klausa "superseded oleh spec admin-redesign ('Permukaan Tenang') untuk komposisi kartu; module grid & MiniStat cards bukan mandat".
  - Pertimbangkan memindah file ke status "archived/historical".

### 15. dashboard-spec.md — NETRAL (prosisten fungsional)

- Berisi metrik, statistics widget, permission matrix ("Reset Layout"), DASH_004 "Statistics Not Available". Tidak mempreskripsikan bentuk permukaan/kartu.
- Status: **NETRAL**. Revisi minimum: tidak ada (relevansi permukaan rendah).

---

## D. `docs/01-domains/03-dashboard/*`

### 16. README.md — BENTROK (ringan, taksonomi feature)

- Aturan relevan: §Features — "**Welcome Card**, **Statistics Card**, Quick Access, Recent Activities, **Announcement Panel**, System Information"; §Scope — Statistics, Quick Access, Recent Activities, Announcements.
- Status: **BENTROK (ringan)** — taksonomi feature dibingkai sebagai kartu (Welcome Card / Statistics Card / Announcement Panel), memperkuat mental-model "dashboard = kartu".
- Revisi minimum: netralkan penamaan — "Statistics" (bukan "Statistics Card"), "Announcements" (bukan "Panel"), "Welcome" (bukan "Welcome Card"). Bila kronologis layout berubah (stat grid dibatasi), §Overview/Scope tak perlu detail layout.

### 17. ui.md — BENTROK (paling kuat di domain docs)

- Aturan relevan: §Layout = urutan kaku "Header → **Statistics** → Quick Access → Recent Activities → Announcements"; §Components "**Statistics Card** menampilkan: Total User, Total Program, Total Surat, Total Sertifikat, Total Berita".
- Status: **BENTROK** — mempreskripsikan (a) statistik sebagai kartu, (b) 5 total statistik sebagai konten wajib, (c) urutan vertikal tetap. Arah "batasi stat grid & gabung" bentrok langsung dengan (a)+(b); pemindahan daftar ke divider-row bentrok dengan (c) bila urutan dirombak.
- Revisi minimum:
  - §Components: ganti "Statistics Card" menjadi "Statistics" — komposisi (grid vs baris, jumlah) **ditentukan spec admin-redesign**, bukan dokumen.
  - §Layout: ubah dari urutan kaku menjadi "urutan yang ditetapkan spec surface"; contoh urutan boleh, tetapi bukan mandat. Baris stat + list divider-row adalah bentuk sah.
  - §Acceptance Criteria: hindari istilah kartu.

### 18. permissions.md — BENTROK (ringan, hanya kata)

- Aturan relevan: permission `dashboard.statistics` = "Hak untuk melihat **seluruh kartu statistik**"; widget authorization (widget disembunyikan bila tanpa permission).
- Status: **BENTROK (ringan)** — deskripsi permission pakai kata "kartu statistik"; aturan RBAC/widget itu sendiri **MENDUKUNG** dan tidak berubah.
- Revisi minimum: reword "kartu statistik" → "surface statistik/baris statistik". Permission identity (`dashboard.statistics`, dsb.) tidak berubah.

### 19. roadmap.md — NETRAL

- v1.1 "Grafik Statistik, Filter Periode"; v1.2 widget config; v2.0 drag-drop widget. Mengasumsikan widget dashboard, tidak mempreskripsikan kartu.
- Status: **NETRAL**. Revisi minimum: tidak ada.

### 20. business-rules.md — MENDUKUNG

- Widget independen (satu gagal, lain tetap tampil); statistik = data aktif; performance (pagination). Tidak ada aturan kartu; kompatibel dengan daftar/baris independen.
- Status: **MENDUKUNG**. Revisi minimum: tidak ada.

### 21. api.md / database.md / workflow.md / validation.md — NETRAL

- Semua fungsional (endpoint read-only, simulasi `statistics`/`activities`/`announcements`/`quickAccess`, soft-delete, permission). Tidak menyentuh bentuk permukaan.
- Status: **NETRAL**. Revisi minimum: tidak ada.

---

## E. `.scratch/*`

### 22. kaca-kristal-glass-overhaul/spec.md — STALE (sudah ditandai sendiri)

- Header spec sendiri menandai **STALE (2026-09)**: disupersede oleh `DESIGN.md`, `docs/08-design-system/*`, `PRODUCT.md`; referensi font (Newsreader/Hanken/Spline / Space Grotesk) tidak berlaku.
- Admin story #11 ("module/content cards to be glass agar admin serupa public") sudah usang sebagai arah — arah baru "kurangi kartu" membuat isu glass-on-cards makin tidak relevan, dan "hard rules must remain solid (tables, forms, dense lists)" di spec ini justru **mendukung** arah divider-row.
- Rekomendasi: biarkan ditandai stale; jangan diimplementasi. Menjadi referensi historis saja.

### 23. tema-swipe-skiper-ui/spec.md — AKTIF (bukan stale; tidak bentrok)

- Status "Active", `ready-for-agent`. Lingkup: transformasi tema navbar publik; eksplisit "**admin CMS tidak mendapat theme toggle**". Tidak memengaruhi permukaan admin.
- Efek: menandai `motion.md` §Transisi Tema (cross-fade) sebagai stale/disupersede — update motion.md ditracking sebagai pekerjaan dokumen terpisah oleh spec itu sendiri (belum dilakukan).

---

## F. `app/globals.css` — MENDUKUNG (sumber kebenaran token)

- Blok `--admin-*` (`:root` lines 144-155, `.dark` 240-251): `--admin-sidebar-*`, `--admin-content-bg/fg` (warm amber/taupe), `--admin-card-bg/border`, `--admin-border`, `--admin-input-*`. Kelas `.admin` (line 260): content bg/fg, min-height 100dvh, `font-family: var(--font-body)`.
- `.admin h1..h6` → Fraunces `--font-heading`; `.admin .stat-number` → `font-heading font-semibold tabular-nums`. Radius standar `--radius` → `rounded-xl` = 1.05rem. Shadow `--lim-shadow-*` (sm/md/lg).
- Status: **MENDUKUNG / constraint** — arah surface "dalam keluarga token yang ada" persis merujuk blok ini. Tokens kartu & stat-number tetap valid bila stat dirender sebagai baris.
- Revisi minimum: tidak ada (jangan ubah token; arah diimplementasi di atas token ini). Catatan: `--admin-card-bg` tetap dipakai kartu form/tabel.

---

## G. Rekap

### Bentrok (perlu revisi minimal agar tidak menghambat arah)
| Dokumen | Konflik | Revisi minimal |
|---|---|---|
| `prd-admin-dashboard-refactor.md` | font Bebas Neue/Lato (superseded), Welcome Card + Module Grid + 4 MiniStat + AC-06 hover lift | tandai superseded (font → Fraunces/Inter; komposisi kartu → spec admin-redesign) |
| `docs/01-domains/03-dashboard/ui.md` | urutan kaku Header→Stats→…; "Statistics Card" 5 total | netralkan permukaan; buat contoh urutan bukan mandat |
| `docs/01-domains/03-dashboard/README.md` | Features "Welcome Card / Statistics Card / Announcement Panel" | netralkan penamaan |
| `docs/01-domains/03-dashboard/permissions.md` | deskripsi "kartu statistik" | reword → surface statistik |
| `components.md` | §Cards "Statistics"; StatCard/MiniStat "di dalam kartu lain"; `SectionCard` rounded-2xl (stale) | StatCard surface-neutral; hapus rounded-2xl → rounded-xl |
| `responsive.md` | contoh stat grid `grid-cols-4` | tandai contoh (bukan mandat), stat boleh divider-row |
| `spacing.md` | contoh stat grid; §Card `rounded-lg` (stale vs theme.md) | tandai contoh; perbaiki radius |

### Netral / mendukung
`layout.md` (PageContainer full-width), `tables.md`, `forms.md`, `typography.md`, `colors.md`, `motion.md` (kecuali §Transisi Tema), `navigation.md`, `accessibility.md`, `icons.md`, `DESIGN.md`, `dashboard-spec.md`, `roadmap.md`, `business-rules.md`, `api.md`, `database.md`, `workflow.md`, `validation.md`, `app/globals.css`, `theme.md` (glass/solid-dense-data malah mendukung).

### Stale / kontradiktif (perlu call-out)
1. `prd-admin-dashboard-refactor.md` — font Bebas Neue/Lato disupersede `typography.md`/`globals.css`; prescriptions kartu inert (Completed).
2. `.scratch/kaca-kristal-glass-overhaul/spec.md` — self-flagged STALE (font & glass-on-cards tidak berlaku).
3. `components.md` §SectionCard `rounded-2xl` — stale vs kode (`rounded-xl`) & `theme.md`.
4. `spacing.md` §Card `rounded-lg` — kontradiksi `theme.md` v1.1 (`rounded-xl`).
5. `motion.md` §Transisi Tema (cross-fade) — disupersede `tema-swipe-skiper-ui` (Active); update dokumen belum dilakukan.
6. Drift kode-vs-dokumen: `app/(dashboard)/admin/layout.tsx` membungkus konten `max-w-7xl` vs `layout.md` yang menyatakan PageContainer tanpa batas lebar.