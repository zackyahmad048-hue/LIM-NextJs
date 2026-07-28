# Typography

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `typography.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar tipografi yang digunakan pada LIM Digital Platform.

Typography memastikan seluruh aplikasi memiliki hierarki visual yang jelas, mudah dibaca, konsisten, dan mendukung berbagai ukuran layar.

---

# Objectives

Typography bertujuan untuk:

* Meningkatkan keterbacaan.
* Menjaga konsistensi visual.
* Mempermudah implementasi Frontend.
* Mendukung Accessibility.
* Menjadi bagian dari Design Token.

---

# Typography Principles

Seluruh tipografi harus:

* Mudah dibaca.
* Konsisten.
* Responsif.
* Mendukung berbagai bahasa.
* Memiliki hierarki yang jelas.

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

* Source Code
* API Key
* Identifier
* Log

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

* Nyaman dibaca.
* Konsisten.
* Menyesuaikan ukuran teks.

Heading menggunakan line height lebih rapat dibanding Body Text.

---

# Letter Spacing

Digunakan untuk:

* Heading
* Button
* Caption

Body Text menggunakan Letter Spacing standar.

---

# Text Alignment

Default:

```text id="typo03"
Left Align
```

Center hanya digunakan untuk:

* Hero Section
* Empty State
* Loading
* Landing Page

Right Align digunakan untuk:

* Numeric Data
* Currency
* Statistik

---

# Text Colors

Menggunakan Color Token.

Kategori:

* Primary Text
* Secondary Text
* Disabled Text
* Error Text
* Success Text
* Link Text

Hardcoded color tidak diperbolehkan.

---

# Responsive Typography

Ukuran teks harus menyesuaikan:

* Mobile
* Tablet
* Desktop

Heading dapat berubah ukuran sesuai Breakpoint.

---

# Text Styles

## Heading

Digunakan untuk:

* Judul Halaman
* Judul Section
* Judul Card

---

## Body

Digunakan untuk:

* Konten utama.
* Penjelasan.
* Artikel.

---

## Caption

Digunakan untuk:

* Timestamp
* Metadata
* Informasi tambahan

---

## Label

Digunakan pada:

* Form
* Badge
* Status

---

## Button

Digunakan untuk seluruh komponen Button.

Button tidak menggunakan variasi ukuran font yang berbeda-beda.

---

# Accessibility

Typography wajib:

* Mudah dibaca.
* Tidak menggunakan ukuran terlalu kecil.
* Memiliki kontras yang cukup.
* Mendukung Zoom Browser.
* Mendukung Screen Reader.

---

# Best Practices

* Maksimal dua keluarga font.
* Hindari terlalu banyak variasi ukuran.
* Gunakan Heading secara berurutan.
* Jangan menggunakan Bold secara berlebihan.
* Gunakan Design Token untuk seluruh Typography.

---

# Related Documents

* README.md
* colors.md
* theme.md
* accessibility.md

---

# Acceptance Criteria

* Seluruh teks menggunakan Typography Scale.
* Font konsisten di seluruh aplikasi.
* Responsive pada seluruh perangkat.
* Memenuhi standar Accessibility.
* Typography menjadi acuan resmi implementasi UI LIM Digital Platform.
