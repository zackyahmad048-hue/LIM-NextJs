# Accessibility

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `accessibility.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar **Accessibility (A11y)** yang diterapkan pada seluruh antarmuka LIM Digital Platform.

Accessibility memastikan aplikasi dapat digunakan oleh seluruh pengguna, termasuk pengguna dengan keterbatasan penglihatan, pendengaran, motorik, maupun kognitif.

Standar ini mengacu pada **WCAG 2.1 Level AA** sebagai target minimum.

---

# Objectives

Accessibility bertujuan untuk:

- Meningkatkan inklusivitas aplikasi.
- Memenuhi standar internasional.
- Mendukung penggunaan Keyboard.
- Mendukung Screen Reader.
- Meningkatkan User Experience.

---

# Accessibility Principles

Seluruh antarmuka harus memenuhi empat prinsip utama WCAG:

- Perceivable
- Operable
- Understandable
- Robust

---

# Keyboard Navigation

Seluruh komponen harus dapat digunakan menggunakan keyboard.

Minimal mendukung:

- Tab
- Shift + Tab
- Enter
- Space
- Escape
- Arrow Keys (jika diperlukan)

Urutan fokus harus logis dan konsisten.

---

# Focus Indicator

Komponen interaktif wajib memiliki indikator fokus yang jelas.

Contoh:

- Outline
- Border
- Shadow

Focus Indicator tidak boleh dihilangkan.

---

# Color Contrast

Seluruh kombinasi warna harus memenuhi rasio kontras minimum sesuai WCAG 2.1 Level AA.

Warna tidak boleh menjadi satu-satunya indikator informasi.

Contoh:

- Error menggunakan ikon dan teks.
- Success menggunakan ikon dan teks.

---

# Typography

Typography harus:

- Mudah dibaca.
- Mendukung pembesaran (Zoom).
- Tidak menggunakan ukuran terlalu kecil.
- Memiliki line height yang nyaman.

---

# Images

Seluruh gambar informatif wajib memiliki:

- Alternative Text (Alt Text).

Gambar dekoratif dapat menggunakan Alt Text kosong.

---

# Forms

Form wajib:

- Memiliki Label.
- Menampilkan Error yang jelas.
- Menghubungkan Error dengan Field terkait.
- Mendukung Autofill bila sesuai.

Placeholder tidak boleh menggantikan Label.

---

# Icons

Ikon harus:

- Konsisten.
- Memiliki Label jika berdiri sendiri.
- Tidak menjadi satu-satunya penyampai informasi.

---

# Tables

Tabel wajib:

- Menggunakan Header.
- Mendukung Screen Reader.
- Tetap dapat digunakan pada perangkat Mobile.

---

# Notifications

Notifikasi harus:

- Mudah dikenali.
- Tidak hanya menggunakan warna.
- Memiliki teks yang jelas.
- Dapat dibaca oleh Screen Reader.

---

# Responsive Accessibility

Accessibility harus tetap terjaga pada:

- Desktop
- Tablet
- Mobile

Seluruh fungsi tetap dapat diakses tanpa kehilangan informasi.

---

# Testing Accessibility

Pengujian meliputi:

- Keyboard Navigation
- Screen Reader
- Color Contrast
- Zoom hingga 200%
- Responsive Layout
- Focus Management

---

# Best Practices

- Gunakan Semantic HTML.
- Gunakan ARIA hanya jika diperlukan.
- Hindari Auto Focus tanpa alasan yang kuat.
- Pastikan seluruh aksi dapat dilakukan tanpa Mouse.
- Uji Accessibility secara berkala selama pengembangan.

---

# Related Documents

- README.md
- colors.md
- typography.md
- components.md
- forms.md
- navigation.md
- theme.md

---

# Acceptance Criteria

- Seluruh komponen memenuhi WCAG 2.1 Level AA.
- Navigasi keyboard berfungsi dengan baik.
- Screen Reader dapat membaca elemen penting.
- Kontras warna memenuhi standar.
- Accessibility menjadi standar resmi implementasi UI LIM Digital Platform.
