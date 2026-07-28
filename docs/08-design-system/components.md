# Components

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `components.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar komponen antarmuka (UI Components) yang digunakan pada LIM Digital Platform.

Seluruh komponen harus bersifat **Reusable**, **Accessible**, **Responsive**, dan **Consistent** sehingga dapat digunakan di seluruh aplikasi tanpa membuat variasi implementasi yang tidak perlu.

---

# Objectives

UI Components bertujuan untuk:

* Menyeragamkan tampilan antarmuka.
* Mempercepat pengembangan Frontend.
* Mengurangi duplikasi komponen.
* Mempermudah maintenance.
* Mendukung Design Token.

---

# Component Principles

Seluruh komponen wajib:

* Reusable
* Predictable
* Modular
* Responsive
* Accessible
* Theme Aware

---

# Buttons

Jenis Button:

* Primary
* Secondary
* Outline
* Ghost
* Danger
* Link

State:

* Default
* Hover
* Active
* Focus
* Disabled
* Loading

Button harus mendukung:

* Icon
* Icon Only
* Full Width
* Different Sizes

---

# Cards

Digunakan untuk:

* Dashboard Widget
* Program
* Article
* Statistics
* User Profile

Card dapat memiliki:

* Header
* Body
* Footer
* Action Area

---

# Tables

Fitur wajib:

* Sorting
* Pagination
* Search
* Filtering
* Empty State
* Loading State
* Responsive Layout

Mendukung:

* Row Selection
* Bulk Action
* Expandable Row

---

# Badges

Digunakan untuk:

* Status
* Label
* Counter
* Category

Variasi:

* Primary
* Success
* Warning
* Error
* Neutral

---

# Alerts

Jenis Alert:

* Success
* Warning
* Error
* Information

Alert mendukung:

* Icon
* Title
* Description
* Dismiss Action

---

# Modals

Digunakan untuk:

* Confirmation
* Form
* Preview
* Detail View

Modal mendukung:

* Header
* Body
* Footer
* Close Action

---

# Tabs

Digunakan untuk:

* Detail Page
* Settings
* Dashboard
* Reports

Jenis:

* Horizontal
* Vertical

---

# Pagination

Komponen wajib mendukung:

* Previous
* Next
* Page Number
* Page Size
* Total Data

---

# Loading Components

Jenis Loading:

* Spinner
* Skeleton
* Progress Indicator

Loading harus digunakan untuk operasi yang memerlukan waktu lebih dari beberapa ratus milidetik.

---

# Empty State

Ditampilkan ketika:

* Tidak ada data.
* Hasil pencarian kosong.
* Belum ada aktivitas.

Empty State minimal berisi:

* Ilustrasi/Icon
* Judul
* Deskripsi
* Call To Action (Opsional)

---

# Error State

Ditampilkan ketika:

* Gagal memuat data.
* Koneksi terputus.
* Terjadi kesalahan sistem.

Error State menyediakan:

* Pesan yang jelas.
* Tombol Retry.
* Informasi yang relevan.

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

* Mendukung Keyboard Navigation.
* Memiliki Focus Indicator.
* Menggunakan Semantic HTML.
* Mendukung Screen Reader.
* Memenuhi WCAG 2.1 Level AA.

---

# Best Practices

* Gunakan komponen yang sudah tersedia.
* Hindari membuat variasi baru tanpa kebutuhan yang jelas.
* Gunakan Design Token.
* Pertahankan perilaku komponen tetap konsisten.
* Dokumentasikan perubahan pada komponen bersama Design System.

---

# Related Documents

* README.md
* colors.md
* typography.md
* forms.md
* navigation.md
* theme.md
* accessibility.md

---

# Acceptance Criteria

* Seluruh komponen dapat digunakan kembali (Reusable).
* Komponen konsisten di seluruh aplikasi.
* Mendukung Light dan Dark Theme.
* Memenuhi standar Accessibility.
* Components menjadi acuan resmi implementasi UI pada LIM Digital Platform.
