# Typography

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `typography.md`

**Version:** 1.1

**Status:** Approved

Perubahan pada 1.1: penambahan aturan hierarki heading untuk mengatasi visual monoton (weight & size contrast antara heading vs body).

---

# Overview

Dokumen ini mendefinisikan standar tipografi yang digunakan pada LIM Digital Platform.

---

# Public Website — Empat Peran Tipografi ("Taqwim")

Situs publik (`app/(public)/`) memakai empat keluarga font via `next/font/google`, masing-masing satu peran spesifik:

| Peran     | Font          | Penggunaan                                                              |
| --------- | ------------- | ----------------------------------------------------------------------- |
| Heading   | Fraunces      | Judul (h1/h2/h3), serif editorial, title case — karakter tenang & reflektif (SOFT=30, WONK=0) |
| Body/UI   | Inter         | Teks isi, kontrol, label — suara antarmuka                               |
| Data      | JetBrains Mono| Jam, waktu shalat, derajat, koordinat, angka tabel — "instrument readout"|
| Arab      | Reem Kufi     | Eyebrow marginalia (`الفجر`), kolofon (`تم بحمد الله`), baris Hijriah    |

Pemetaan token (definisi di `app/layout.tsx` + `app/globals.css`):

```text id="typo-public"
--font-heading -> Fraunces
--font-body    -> Inter
--font-data    -> JetBrains Mono
(arab)         -> Reem Kufi
```

Catatan peran: kaidah "maksimal dua keluarga font" di bawah sengaja dilonggarkan hanya untuk situs publik karena setiap keluarga punya satu pekerjaan nyata — angka/data membaca sebagai alat hisab, bukan dekorasi. Font definitif mengikuti `app/layout.tsx`; tabel historis (Newsreader/Hanken Grotesk/Spline Sans Mono, Bebas Neue/Lato, lalu Space Grotesk) sudah diganti. Uppercase tidak lagi dipaksakan global pada heading (Fraunces bekerja dalam title case serif); uppercase hanya dipakai opt-in pada eyebrow/label kecil. Berat font heading dibiarkan per-komponen — tidak dipaksa 500 di `globals.css` supaya hero bisa `font-bold` dan judul section `font-semibold`.

Typography memastikan seluruh aplikasi memiliki hierarki visual yang jelas, mudah dibaca, konsisten, dan mendukung berbagai ukuran layar.

---

# Hierarki (anti-monoton)

Untuk mencegah tampilan monoton, pertahankan kontras hierarki heading vs body:

- **Heading** (Fraunces, serif): `font-semibold`–`font-bold`, `tracking-tight`, `letter-spacing: -0.01em` — pesan dominan.
- **Body** (Inter, sans): `font-normal` (regular), warna `foreground`/`muted-foreground` — suara pendukung.
- **H1 hero**: `text-4xl sm:text-5xl lg:text-6xl` (besar, tegas).
- **H2 section**: `text-2xl sm:text-3xl` (tegas tapi lebih kecil dari H1).
- **H3 card**: `text-lg sm:text-xl` (judul kartu, `font-semibold`).
- **Eyebrow/label**: utility `uppercase text-xs tracking-widest text-muted-foreground` — jangan pakai serif untuk eyebrow.

Jangan buat semua heading dan body satu berat — kontras berat antara heading (semibold/bold) dan body (normal) adalah kunci hierarki yang terasa profesional.

---

# Objectives

Typography bertujuan untuk:

- Meningkatkan keterbacaan.
- Menjaga konsistensi visual.
- Mempermudah implementasi Frontend.
- Mendukung Accessibility.
- Menjadi bagian dari Design Token.

---

# Typography Principles

Seluruh tipografi harus:

- Mudah dibaca.
- Konsisten.
- Responsif.
- Mendukung berbagai bahasa.
- Memiliki hierarki yang jelas.

---

# Font Family

Jenis font utama:

```text id="typo01"
Primary Font

Sans Serif
```

Jenis font pendukung:

```text id="typo02"
Monospace
```

Digunakan untuk:

- Source Code
- API Key
- Identifier
- Log

---

# Typography Scale

| Style      | Usage           |
| ---------- | --------------- |
| Display    | Landing Page    |
| H1         | Page Title      |
| H2         | Section Title   |
| H3         | Card Title      |
| H4         | Sub Section     |
| H5         | Small Heading   |
| H6         | Minor Heading   |
| Body Large | Main Content    |
| Body       | Default Text    |
| Body Small | Supporting Text |
| Caption    | Metadata        |
| Label      | Form Label      |
| Button     | Button Text     |

---

# Font Weight

| Weight    | Usage      |
| --------- | ---------- |
| Light     | Decorative |
| Regular   | Body Text  |
| Medium    | Label      |
| Semi Bold | Card Title |
| Bold      | Heading    |

---

# Line Height

Gunakan Line Height yang:

- Nyaman dibaca.
- Konsisten.
- Menyesuaikan ukuran teks.

Heading menggunakan line height lebih rapat dibanding Body Text.

---

# Letter Spacing

Digunakan untuk:

- Heading
- Button
- Caption

Body Text menggunakan Letter Spacing standar.

---

# Text Alignment

Default:

```text id="typo03"
Left Align
```

Center hanya digunakan untuk:

- Hero Section
- Empty State
- Loading
- Landing Page

Right Align digunakan untuk:

- Numeric Data
- Currency
- Statistik

---

# Text Colors

Menggunakan Color Token.

Kategori:

- Primary Text
- Secondary Text
- Disabled Text
- Error Text
- Success Text
- Link Text

Hardcoded color tidak diperbolehkan.

---

# Responsive Typography

Ukuran teks harus menyesuaikan:

- Mobile
- Tablet
- Desktop

Heading dapat berubah ukuran sesuai Breakpoint.

---

# Text Styles

## Heading

Digunakan untuk:

- Judul Halaman
- Judul Section
- Judul Card

---

## Body

Digunakan untuk:

- Konten utama.
- Penjelasan.
- Artikel.

---

## Caption

Digunakan untuk:

- Timestamp
- Metadata
- Informasi tambahan

---

## Label

Digunakan pada:

- Form
- Badge
- Status

---

## Button

Digunakan untuk seluruh komponen Button.

Button tidak menggunakan variasi ukuran font yang berbeda-beda.

---

# Accessibility

Typography wajib:

- Mudah dibaca.
- Tidak menggunakan ukuran terlalu kecil.
- Memiliki kontras yang cukup.
- Mendukung Zoom Browser.
- Mendukung Screen Reader.

---

# Best Practices

- Maksimal dua keluarga font.
- Hindari terlalu banyak variasi ukuran.
- Gunakan Heading secara berurutan.
- Jangan menggunakan Bold secara berlebihan.
- Gunakan Design Token untuk seluruh Typography.

---

# Related Documents

- README.md
- colors.md
- theme.md
- accessibility.md

---

# Acceptance Criteria

- Seluruh teks menggunakan Typography Scale.
- Font konsisten di seluruh aplikasi.
- Responsive pada seluruh perangkat.
- Memenuhi standar Accessibility.
- Typography menjadi acuan resmi implementasi UI LIM Digital Platform.