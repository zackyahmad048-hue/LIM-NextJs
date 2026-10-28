# Spec — Redesign Admin: Tenang Modern

**Status:** Approved (menggantikan `spec-admin-permukaan-tenang.md` — superseded)
**Pemilik:** admin `app/(dashboard)/admin/` — sistem permukaan & komposisi halaman admin
**Tanggal:** 2026-10-08
**Rujukan:** `.scratch/admin-redesign/map.md`, `docs/05-decisions/ADR-011-action-shell-flat-factory.md`, `CONTEXT.md`

---

## 1. Prinsip

1. **Kaca hanya pada permukaan `raised`** — form, tabel, dan kartu memakai `.glass` (skill UI/UX Glassmorphism). Chrome admin (rail, topbar), section `plain`, dan teks panjang tetap **solid**. Identitas tetap datang dari tipografi (Fraunces untuk judul, `font-data` untuk angka) dan aksen oranye untuk aksi/aktif; warna modul hadir sebagai **satu tint per kartu** (`.glass-tint-{modul}`), bukan sebagai identitas utama.
2. **Satu tata bahasa permukaan**: `plain` (divider-row, default) + `raised` (permukaan kaca untuk form/tabel/kartu) + `rail` (navigasi, solid).
3. **Elevasi lewat kaca pada `raised`.** `shadow-md` hanya menyertai `.glass` (disediakan kelasnya) dan pada modal/sheet/popover. Section `plain` dan chrome tetap tanpa shadow.
4. **Mobile bukan afterthought.** Setiap band punya kolaps eksplisit; tabel menjadi baris tertumpuk di `<sm`; aksi utama sticky di bawah viewport pada viewport kecil.
5. **Gerak = umpan balik saja.** Transisi hover/focus/`:active` 150–200ms. Tidak ada `AnimatePresence` per baris, tidak ada parallax, dan `prefers-reduced-motion: reduce` mematikan semua gerak dekoratif.
6. **API primitif tetap.** `Band`, `StatStrip`, `StatRow`, `ListRow`, `FormGroup`, `DataTable` mempertahankan nama & prop inti — hanya resep kelas dan prop opsional baru yang bertambah. 26 pemakai `Band` migrasi aman.

Anti-pattern yang dilarang (checklist kegagalan): card-in-card, grid modul berkartu, `glass` pada chrome atau section `plain`, lebih dari dua lapis kaca, eyebrow di atas setiap header, `min-w-*` yang memaksa scroll horizontal pada viewport kecil.

## 2. Tokens (dipertahankan)

- Aksen: `oklch(0.45 0.195 38.4)` (light) / `oklch(0.47 0.157 37.3)` (dark), hue oranye.
- Radius: `rounded-xl` untuk kotak kerja, `rounded-full` hanya untuk badge/avatar.
- Dark default: `<AppThemeProvider attribute="class" defaultTheme="dark">`.
- Section pertama tanpa border-top; selanjutnya `border-t border-admin-border/60`.

### 2.1 Satu dunia warna: admin mengikuti platform (2026-10-26)

Awalnya admin memakai palet hangat sendiri (`--admin-*`, hue 60–90) berbeda dari
publik yang indigo malam (hue 260). Ini menyebabkan pulau indigo di dark mode
pada primitif shadcn (dialog, popover, dropdown, skeleton, hover button) karena
kelas generik (`bg-card`, `bg-popover`, `text-muted-foreground`, `border`, dst.)
menggunakan token global.

Keputusan revisi (2026-10-26): **admin tidak punya palet terpisah lagi**.
Semua token `--admin-*` di `:root` (dan `.dark`) didefinisikan sebagai **alias**
ke token global (`--sidebar-*`, `--background`, `--card`, `--primary`, dsb.):
- Rail sidebar → `--sidebar` / `--sidebar-foreground` / `--sidebar-border`
- Item aktif rail → `--primary` / `--primary-foreground` (aksen Oranye LIM)
- Latar content & kartu → `--background` / `--card` / `--border` / `--input`

Dampak: publik dan admin identik di kedua tema. Blok `html:has(.admin)` mapping
token generik dihapus — tidak diperlukan lagi. Spesifikasi ini menetapkan:
**Token admin adalah alias, bukan override.** Warna status semantik
(`destructive`/`success`/`warning`) dan `--chart-*` tetap global.

## 3. Primisi

| Primisi | Peran | Catatan |
|---|---|---|
| `Band variant="plain"` (default) | pembatas section | `border-t border-admin-border pt-4 lg:pt-5`; section pertama `border-t-0 pt-0` |
| `Band variant="raised"` | permukaan form/tabel/kartu | `glass rounded-xl p-4 lg:p-5` + opsional `glass-tint-{modul}`; `.glass` menyediakan border, background, dan shadow sendiri |
| `Band` `tint` | opsional | satu tint modul per kartu pada permukaan `raised` (`.glass-tint-{modul}`); default tanpa tint |
| `StatStrip` | ≤4 angka, grid 2 kolom di <sm, strip di ≥sm | nilai `font-data tabular-nums` |
| `StatRow` | angka ke-5+ / ringkas | baris label:value dengan divider |
| `ListRow` | baris ringkasan profil | li + `divide-y` |
| `FormGroup` | satu grup fieldset | legend + border-t (F1 spec lama) |
| `DataTable` | tabel utama | lihat §4 |

## 4. `DataTable` — kontrak

- Props: `columns`, `data`, `pageCount?`, `onPaginationChange?`, `manualPagination?`, `loading?`, `error?`, `emptyMessage?`.
- **Dual mode**: client-side (default, data penuh) atau server-side (`manualPagination + pageCount + onPaginationChange`). Tabel server pagination lempar state ke parent, bukan memotong sendiri.
- **Mode loading**: baris skeleton (`Skeleton` primitif, tinggi baris konsisten, tidak spinner bulat).
- **Mode error**: `DataError` dengan tombol "Coba lagi" — error per-table, bukan toast.
- **Mode kosong**: `DataEmpty` dengan CTA yang menuliskan cara mengisi.
- **Mobile (<sm)**: baris menjadi card-list `label: value` (kolom -> label di atas nilai); tidak ada scroll horizontal. `min-w-*` pada tabel tetap dipakai hanya di ≥sm.
- **Toolbar/pagination**: sembunyikan saat state kosong / pagination satu halaman.

## 5. Komposisi halaman

Setiap halaman admin = salah satu dari tiga pola, dengan section pertama polos:

1. **LIST** — `PageContainer` → `PageHeader` (judul, deskripsi, aksi primer) → `Band` berisi `DataTable` (di dalamnya toolbar) → paginasi di bawah band.
2. **FORM** — `PageHeader` → `Band variant="raised"` → `FormGroup` berurutan → aksi sticky (`<div className="sticky bottom-0 ... bg-admin-content-bg/95 backdrop-blur">`).
3. **DASHBOARD** (`/admin`) — sambutan, `StatStrip` ≤4, quick actions (`ListRow` + aksi), aktivitas terbaru (list divider). Tanpa kumpulan kartu modul.

Komposisi "rail kiri + satu band kerja kanan" (varian B prototipe) dipakai hanya bila halaman punya dua area data berdampingan — bukan default.

## 6. Checklist per halaman (gate)

- [ ] `glass` hanya pada `variant="raised"`; chrome dan section `plain` tetap solid; ≤2 lapis kaca.
- [ ] 0 card-in-card.
- [ ] ≤4 stat prominent; kelima sebagai `StatRow`.
- [ ] Toolbar / paginasi hanya tampil saat relevan.
- [ ] State loading → skeleton; error → `DataError`; kosong → `DataEmpty`.
- [ ] Mobile 375px: tanpa scroll horizontal di luar tabel (tabel → card-list <sm), target sentuh ≥44px, aksi utama sticky.
- [ ] `prefers-reduced-motion` mereduksi gerak.
- [ ] WCAG AA: kontras teks ≥4.5, form berlabel, fokus terlihat.
- [ ] `npm run check` hijau (lint 0 · typecheck 0 · regresi 0).

## 7. Migrasi

Urutan: (1) primitif — `Band`/`DataTable`/`StatStrip`/`FormGroup`, (2) tracer 3 halaman, (3) modul terpadat dulu: `sekretariat` (26) → `falak` → `program` → `content` → `twk` → `system` → `profil/homepage/reports`. Divalidasi `npm run check` per batch.

### 7.1 Keputusan saat eksekusi

- **Server-pagination became the only pattern.** `TablePagination` tidak lagi dipakai halaman mana pun; 4 halaman yang masih memakainya (`falak/rukyat`, `falak/hisab`, `program/list`, `content/posts`) dimigrasikan ke mode server `DataTable`. Ini sekaligus menutup cacat **double pagination** (paginator server 20 baris + paginasi client `pageSize` 10 di satu tampilan).
- **`tint` diaktifkan kembali (keputusan 2026-10-09).** Keempat halaman yang sebelumnya dibuang kini memakai `tint` pada band statistik teratasnya: `content` → `konten`, `falak` → `falak`, `program` → `program`, `reports` → `sistem`.
- **Program dashboard kehilangan 6 kartu stat.** Semula 6 kartu berkolor dalam grid — melanggar aturan ≤4 stat dan pola "grid modul berkartu". Diganti `StatStrip` (4) + `StatRow` (2); field `color` per-kartu dihapus.
- **`twk/lembaga/[id]` 5 section → 2 band alur**, sesuai peta halaman di spec lama: **Identitas** (lembaga, pengasuh, penanggung jawab) dan **Kondisi & Pengajuan** (kondisi lembaga, permohonan guru bantu). Field tetap 29 `Field` + 3 `FieldList` + 2 `PhotoField`, tidak ada yang dihapus.
- **Setiap `<Band>` kini punya `variant` eksplisit** (`plain`/`raised`) — tidak ada lagi penggunaan default yang implisit. Penentuan variant berbasis isi: blok yang memuat field form atau tabel → `raised`; panel data → `plain`.
- **Batas-kuasa:** migrasi ini pada **permukaan** saja. Restrukturisasi isi halaman di luar peta (mis. menyatukan form `twk/index`, `page-editor`, `post-form` ke `FormGroup`) belum dikerjakan — `FormGroup` masih dipakai 14 file, sementara ~12 form admin lain masih merangkai `div` + `Label` sendiri.

## 8. Status dokumen terkait

- `spec-admin-permukaan-tenang.md` — **superseded**, dipertahankan sebagai historis.
- `docs/08-design-system/theme.md` — shadow: permukaan kerja admin tanpa shadow (elevasi ditandai border).
- `docs/08-design-system/tables.md` — pagination: server-mode `DataTable`; larangan paginator ganda.
- `docs/08-design-system/components.md` — `Band` dua varian, `DataTable` dua mode pagination + card-list `<sm`, angka `font-data`.
- `DESIGN.md` — scope shadow dipersempit ke kartu konten publik; admin datar.
- `prd-admin-dashboard-refactor.md` — sudah **superseded**, tidak dipulihkan.

Semua dokumen di atas disinkronkan pada 2026-10-08 mengikuti kode yang berjalan.
