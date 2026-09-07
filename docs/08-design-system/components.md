# Components

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `components.md`

**Version:** 1.1

**Status:** Approved

Perubahan pada 1.1: ditambahkan seksi "Admin CMS Shell" (primitif bersama kerangka admin) dan rujukan ke `motion.md`.

---

# Overview

Dokumen ini mendefinisikan standar komponen antarmuka (UI Components) yang digunakan pada LIM Digital Platform.

Seluruh komponen harus bersifat **Reusable**, **Accessible**, **Responsive**, dan **Consistent** sehingga dapat digunakan di seluruh aplikasi tanpa membuat variasi implementasi yang tidak perlu.

> **⚠️ Catatan skop untuk Situs Publik.** Per `PRODUCT.md`, situs publik dibangun ulang total. Jenis/state komponen di bawah (Button punya Primary/Secondary/dst, Card punya Header/Body/dst) adalah **requirement abstrak yang tetap berlaku**; implementasi visualnya mengikuti `colors.md`/`typography.md`/`theme.md` yang sekarang diselaraskan dengan token `app/globals.css` (akar "Khusyu Minimalis"). Bagian **Admin CMS Shell** di bawah eksplisit hanya untuk admin dan tetap mengikat apa adanya.

---

# Objectives

UI Components bertujuan untuk:

- Menyeragamkan tampilan antarmuka.
- Mempercepat pengembangan Frontend.
- Mengurangi duplikasi komponen.
- Mempermudah maintenance.
- Mendukung Design Token.

---

# Component Principles

Seluruh komponen wajib:

- Reusable
- Predictable
- Modular
- Responsive
- Accessible
- Theme Aware

---

# Buttons

Jenis Button:

- Primary
- Secondary
- Outline
- Ghost
- Danger
- Link

State:

- Default
- Hover
- Active
- Focus
- Disabled
- Loading

Button harus mendukung:

- Icon
- Icon Only
- Full Width
- Different Sizes

---

# Cards

Digunakan untuk:

- Dashboard Widget
- Program
- Article
- User Profile

> **Catatan (per `spec-admin-permukaan-tenang.md`):** "Statistics" tidak lagi tercantum sebagai kegunaan kartu — primitif stat bersifat permukaan-netral dan boleh dirender sebagai baris/kolom dalam `band` (stat-strip/stat-row), bukan wajib kartu. Kartu tersisa untuk tempat struktural: form-group dan tabel (plain box).

Card dapat memiliki:

- Header
- Body
- Footer
- Action Area

---

# Admin CMS Shell

Primitif bersama kerangka admin. Wajib dipakai ulang; larang duplikasi gaya.

| Komponen                | Lokasi                                             | Keterangan                                                                                                                            |
| ----------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `chrome.ts`             | `components/admin/shared/chrome.ts`                | Konstanta `glassChrome`, `glassCard`, `softCard` — satu sumber token glass untuk header/sidebar/kartu                                 |
| `PageContainer`         | `components/admin/shared/page-container.tsx`       | Wrapper konten halaman, **full-width tanpa max-w**; hanya padding vertikal (`py-5 lg:py-8`) — inset horizontal ditangani `<main>`                                                                                    |
| `PageHeader`            | `components/admin/shared/page-header.tsx`          | Judul `font-heading` + hairline bawah (`border-b border-border/60 pb-5`) + slot actions                                               |
| `Band`                  | `components/admin/shared/band.tsx`                 | Permukaan section tenang: `border-t` + `p-5` + `bg-admin-card-bg`; pengganti `SectionCard` (legacy dihapus). Judul + aksi = band header; group form = `FormGroup` (fieldset `border-t`, F1) |
| `StatStrip` / `StatRow` | `components/admin/shared/stat-primitives.tsx`      | Angka memakai `font-heading font-semibold tracking-[-0.01em] tabular-nums`; primitif stat **permukaan-netral**, dirender dalam `band` (StatStrip kap 4, ke-5+ = StatRow). Pengganti `StatCard`/`MiniStat` (legacy dihapus) |
| `ListRow`               | `components/admin/shared/list-row.tsx`             | Baris daftar tanpa kotak (`li` + `divide-y`) di dalam `band` — pengganti daftar-dalam-kartu (L1/L2) |
| `DataTable`            | `components/admin/shared/data-table/`              | Tabel kanon admin (tanstack): sortir, global filter, pagination, `DataEmpty`/`DataError`/skeleton; chrome plain box `rounded-xl border` token admin; judul + toolbar milik `band`. Dua mode pagination: client ≤50, server >50 |
| `CommandMenu`           | `components/admin/navigation/command-menu.tsx`     | Pencarian menu global (`Ctrl/Cmd+K`) via `CommandDialog`, terfilter permission                                                        |
| `DateChip`              | `components/admin/shared/date-chip.tsx`            | Chip tanggal Masehi + Hijriah di header (satu-satunya tempat tanggal tampil)                                                          |
| `Header` toolbar        | `components/admin/layout/header.tsx`               | Toggle + breadcrumb dalam chip + search pill; kanan: DateChip + UserMenu                                                              |
| Sidebar                 | `components/admin/layout/sidebar.tsx`              | Transisi expand submenu (lihat `motion.md`)                                                                                           |

---

# Tables

Fitur wajib:

- Sorting
- Pagination
- Search
- Filtering
- Empty State
- Loading State
- Responsive Layout

Mendukung:

- Row Selection
- Bulk Action
- Expandable Row

---

# Badges

Digunakan untuk:

- Status
- Label
- Counter
- Category

Variasi:

- Primary
- Success
- Warning
- Error
- Neutral

---

# Alerts

Jenis Alert:

- Success
- Warning
- Error
- Information

Alert mendukung:

- Icon
- Title
- Description
- Dismiss Action

---

# Modals

Digunakan untuk:

- Confirmation
- Form
- Preview
- Detail View

Modal mendukung:

- Header
- Body
- Footer
- Close Action

---

# Tabs

Digunakan untuk:

- Detail Page
- Settings
- Dashboard
- Reports

Jenis:

- Horizontal
- Vertical

---

# Pagination

Komponen wajib mendukung:

- Previous
- Next
- Page Number
- Page Size
- Total Data

---

# Loading Components

Jenis Loading:

- Spinner
- Skeleton
- Progress Indicator

Loading harus digunakan untuk operasi yang memerlukan waktu lebih dari beberapa ratus milidetik.

---

# Empty State

Ditampilkan ketika:

- Tidak ada data.
- Hasil pencarian kosong.
- Belum ada aktivitas.

Empty State minimal berisi:

- Ilustrasi/Icon
- Judul
- Deskripsi
- Call To Action (Opsional)

---

# Error State

Ditampilkan ketika:

- Gagal memuat data.
- Koneksi terputus.
- Terjadi kesalahan sistem.

Error State menyediakan:

- Pesan yang jelas.
- Tombol Retry.
- Informasi yang relevan.

---

# Component States

Seluruh komponen mendukung:

```text id="comp01"
Default

Hover

Focused

Active

Disabled

Loading

Error
```

---

# Accessibility

Seluruh komponen wajib:

- Mendukung Keyboard Navigation.
- Memiliki Focus Indicator.
- Menggunakan Semantic HTML.
- Mendukung Screen Reader.
- Memenuhi WCAG 2.1 Level AA.

---

# Best Practices

- Gunakan komponen yang sudah tersedia.
- Hindari membuat variasi baru tanpa kebutuhan yang jelas.
- Gunakan Design Token.
- Pertahankan perilaku komponen tetap konsisten.
- Dokumentasikan perubahan pada komponen bersama Design System.

---

# Related Documents

- README.md
- colors.md
- typography.md
- forms.md
- navigation.md
- theme.md
- motion.md
- accessibility.md

---

# Acceptance Criteria

- Seluruh komponen dapat digunakan kembali (Reusable).
- Komponen konsisten di seluruh aplikasi.
- Mendukung Light dan Dark Theme.
- Memenuhi standar Accessibility.
- Components menjadi acuan resmi implementasi UI pada LIM Digital Platform.