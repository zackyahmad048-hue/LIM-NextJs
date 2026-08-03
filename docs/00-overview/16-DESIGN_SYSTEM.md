# DESIGN_SYSTEM

**Project:** LIM Digital Platform

**Version:** 1.0

**Status:** Approved

**Document Type:** Design System Specification

---

# Purpose

Dokumen ini mendefinisikan standar desain antarmuka LIM Digital Platform.

Tujuannya adalah menjaga konsistensi tampilan, pengalaman pengguna, dan kemudahan pengembangan pada Website, Admin Portal, dan Mobile Application.

Seluruh implementasi UI wajib mengikuti dokumen ini.

---

# Design Principles

Seluruh antarmuka mengikuti prinsip berikut:

- Simple
- Consistent
- Accessible
- Responsive
- Reusable
- User Focused

---

# Design Philosophy

LIM Digital Platform mengutamakan:

- Informasi lebih penting daripada dekorasi.
- Konsistensi lebih penting daripada variasi.
- Kejelasan lebih penting daripada kompleksitas.
- Komponen dapat digunakan kembali.

---

# Design Language

Karakter desain:

- Modern
- Minimalis
- Profesional
- Bersih
- Mudah dipahami

---

# Layout

Layout menggunakan struktur:

```text id="ds01"
Header

↓

Content

↓

Footer
```

Untuk Admin:

```text id="ds02"
Sidebar

↓

Header

↓

Content
```

---

# Grid System

Menggunakan grid yang fleksibel.

Standar:

- Mobile
- Tablet
- Desktop

Seluruh halaman harus responsif.

---

# Spacing

Gunakan skala spacing yang konsisten.

Contoh:

```text id="ds03"
4

8

12

16

24

32

48

64
```

Tidak menggunakan nilai acak.

---

# Typography

Font utama:

- Sans Serif

Hierarki:

- Heading 1
- Heading 2
- Heading 3
- Body
- Caption

Ukuran teks harus konsisten di seluruh aplikasi.

---

# Color System

Kategori warna:

- Primary
- Secondary
- Success
- Warning
- Error
- Info
- Neutral

Seluruh warna dikelola melalui Theme.

Hardcode warna pada komponen tidak diperbolehkan.

---

# Iconography

Menggunakan satu library ikon yang konsisten.

Aturan:

- Satu ikon untuk satu makna.
- Tidak menggunakan ikon berbeda untuk aksi yang sama.

---

# Button

Jenis tombol:

- Primary
- Secondary
- Outline
- Ghost
- Destructive

Seluruh tombol harus memiliki:

- Hover State
- Focus State
- Disabled State
- Loading State

---

# Form

Seluruh form memiliki:

- Label
- Placeholder (opsional)
- Helper Text (opsional)
- Error Message
- Validation

Error harus ditampilkan di dekat field yang bermasalah.

---

# Input Components

Komponen standar:

- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Date Picker
- File Upload

Seluruh komponen menggunakan gaya yang konsisten.

---

# Table

Table mengikuti standar berikut:

- Pagination
- Sorting
- Filtering
- Search
- Empty State
- Loading State

Gunakan TanStack Table sebagai implementasi utama.

---

# Dialog

Dialog digunakan untuk:

- Konfirmasi
- Form
- Detail

Dialog harus dapat ditutup dengan aman dan tidak menghilangkan data tanpa konfirmasi.

---

# Navigation

Navigasi harus:

- Konsisten.
- Mudah dipahami.
- Tidak berubah antar halaman tanpa alasan.

---

# Feedback

Sistem memberikan feedback melalui:

- Toast
- Alert
- Dialog
- Badge
- Progress Indicator

---

# Loading State

Setiap proses asynchronous harus memiliki indikator loading.

Pengguna tidak boleh dibiarkan menunggu tanpa informasi.

---

# Empty State

Halaman tanpa data harus menampilkan:

- Penjelasan singkat.
- Tombol aksi apabila relevan.

---

# Error State

Apabila terjadi kesalahan, tampilkan:

- Pesan yang jelas.
- Langkah yang dapat dilakukan pengguna.

Hindari pesan teknis.

---

# Responsive Design

Platform mendukung:

- Mobile
- Tablet
- Desktop

Seluruh halaman wajib dapat digunakan pada ketiga ukuran tersebut.

---

# Accessibility

Komponen harus memperhatikan:

- Label yang jelas.
- Navigasi keyboard.
- Kontras warna yang cukup.
- Fokus yang terlihat.

---

# Theme

Platform mendukung:

- Light Mode
- Dark Mode

Seluruh komponen harus kompatibel dengan kedua tema.

---

# Component Reusability

Komponen umum ditempatkan pada library UI bersama.

Duplikasi komponen harus dihindari.

---

# Design Consistency

Komponen dengan fungsi yang sama harus memiliki:

- Tampilan yang sama.
- Perilaku yang sama.
- Validasi yang sama.

---

# Governance

Perubahan terhadap Design System harus:

- Didokumentasikan.
- Diuji pada Website, Admin, dan Mobile.
- Disetujui sebelum diterapkan.

---

# Closing

Design System menjadi acuan resmi seluruh antarmuka LIM Digital Platform.

Dengan sistem desain yang konsisten, proses pengembangan menjadi lebih cepat, pengalaman pengguna lebih baik, dan pemeliharaan aplikasi menjadi lebih mudah.
