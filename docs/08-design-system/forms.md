# Forms

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `forms.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar desain dan perilaku seluruh komponen Form pada LIM Digital Platform.

Form merupakan media utama interaksi pengguna untuk memasukkan, memperbarui, dan memvalidasi data sehingga harus memiliki perilaku yang konsisten, mudah digunakan, dan memenuhi standar aksesibilitas.

---

# Objectives

Standar Form bertujuan untuk:

- Menyeragamkan pengalaman pengguna.
- Mengurangi kesalahan input.
- Mempermudah implementasi Frontend.
- Mendukung Accessibility.
- Menjamin konsistensi validasi.

---

# Form Principles

Seluruh Form harus:

- Sederhana.
- Konsisten.
- Responsif.
- Mudah dipahami.
- Mudah divalidasi.
- Accessible.

---

# Form Layout

Layout standar:

- Label di atas Input.
- Jarak antar Field konsisten.
- Kelompokkan Field yang berkaitan.
- Gunakan Section untuk Form panjang.

---

# Input Components

Komponen standar:

- Text Field
- Text Area
- Password Field
- Number Field
- Email Field
- Phone Field
- Search Field
- URL Field

---

# Selection Components

Komponen pilihan:

- Select
- Multi Select
- Radio Button
- Checkbox
- Toggle Switch

---

# Date & Time Components

Mendukung:

- Date Picker
- Time Picker
- Date Time Picker
- Date Range Picker

---

# File Upload

Mendukung:

- Drag & Drop
- Browse File
- Preview File
- Progress Upload
- Remove File

Validasi:

- MIME Type
- Ukuran File
- Jumlah File

---

# Validation

Validasi dilakukan secara:

- Real-Time (jika sesuai)
- Saat Submit
- Berdasarkan aturan Business Rules

Error ditampilkan di bawah Field yang bermasalah.

---

# Form States

Seluruh Field mendukung:

```text id="form01"
Default

Focused

Filled

Disabled

Read Only

Loading

Error

Success
```

---

# Error Message

Pesan Error harus:

- Singkat.
- Jelas.
- Menjelaskan penyebab.
- Memberikan arahan perbaikan bila memungkinkan.

Contoh:

- Email wajib diisi.
- Format email tidak valid.
- Password minimal 8 karakter.

---

# Required Field

Field wajib:

- Ditandai secara konsisten.
- Dijelaskan pada dokumentasi Form.
- Tidak hanya dibedakan menggunakan warna.

---

# Buttons

Form minimal memiliki:

- Primary Action
- Secondary Action (Opsional)
- Cancel (bila diperlukan)

Button Submit menampilkan Loading ketika proses berlangsung.

---

# Responsive Behavior

Pada Mobile:

- Field menggunakan lebar penuh.
- Label tetap berada di atas.
- Tombol mudah dijangkau.

---

# Accessibility

Form wajib:

- Mendukung Keyboard Navigation.
- Memiliki Focus Indicator.
- Menggunakan Label yang terhubung dengan Input.
- Menampilkan Error yang dapat dibaca Screen Reader.
- Memenuhi WCAG 2.1 Level AA.

---

# Best Practices

- Gunakan Placeholder sebagai contoh, bukan pengganti Label.
- Hindari meminta data yang tidak diperlukan.
- Kelompokkan Field berdasarkan konteks.
- Validasi sedini mungkin tanpa mengganggu pengguna.
- Gunakan komponen Form yang telah distandarkan.

---

# Related Documents

- README.md
- components.md
- colors.md
- typography.md
- accessibility.md

---

# Acceptance Criteria

- Seluruh Form menggunakan komponen standar.
- Validasi ditampilkan secara konsisten.
- Form responsif pada Desktop, Tablet, dan Mobile.
- Memenuhi standar Accessibility.
- Forms menjadi acuan resmi implementasi seluruh Form pada LIM Digital Platform.
