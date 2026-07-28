# Color System

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `colors.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar penggunaan warna pada LIM Digital Platform.

Color System memastikan seluruh antarmuka menggunakan palet warna yang konsisten sehingga meningkatkan identitas visual, keterbacaan, dan pengalaman pengguna.

---

# Objectives

Color System bertujuan untuk:

* Menjaga konsistensi visual.
* Meningkatkan keterbacaan.
* Mempermudah implementasi Theme.
* Mendukung Accessibility.
* Menjadi dasar Design Token.

---

# Color Principles

Seluruh warna harus:

* Konsisten.
* Memiliki kontras yang memadai.
* Mudah dibedakan.
* Mendukung Light dan Dark Theme.
* Tidak digunakan sebagai satu-satunya indikator informasi.

---

# Primary Colors

Digunakan untuk:

* Brand
* Primary Button
* Active Navigation
* Link
* Highlight

| Token       | Usage               |
| ----------- | ------------------- |
| Primary-50  | Background ringan   |
| Primary-100 | Hover ringan        |
| Primary-200 | Selected            |
| Primary-300 | Secondary Highlight |
| Primary-400 | Active              |
| Primary-500 | Primary Color       |
| Primary-600 | Hover               |
| Primary-700 | Pressed             |
| Primary-800 | Dark Variant        |
| Primary-900 | High Contrast       |

---

# Secondary Colors

Digunakan untuk:

* Secondary Button
* Badge
* Card Accent
* Supporting Elements

| Token                        | Usage               |
| ---------------------------- | ------------------- |
| Secondary-50 ~ Secondary-900 | Sesuai kebutuhan UI |

---

# Neutral Colors

Digunakan untuk:

* Background
* Border
* Divider
* Typography
* Surface

| Token       | Usage           |
| ----------- | --------------- |
| Neutral-50  | Page Background |
| Neutral-100 | Card Background |
| Neutral-200 | Border Light    |
| Neutral-300 | Divider         |
| Neutral-400 | Placeholder     |
| Neutral-500 | Secondary Text  |
| Neutral-600 | Body Text       |
| Neutral-700 | Heading         |
| Neutral-800 | Dark Surface    |
| Neutral-900 | Primary Text    |

---

# Semantic Colors

## Success

Digunakan untuk:

* Success Message
* Completed Status
* Success Badge

---

## Warning

Digunakan untuk:

* Warning
* Pending
* Reminder

---

## Error

Digunakan untuk:

* Validation Error
* Failed Status
* Delete Action

---

## Info

Digunakan untuk:

* Information
* Tips
* General Notification

---

# Status Colors

| Status    | Color   |
| --------- | ------- |
| Draft     | Neutral |
| Active    | Primary |
| Published | Success |
| Pending   | Warning |
| Rejected  | Error   |
| Archived  | Neutral |
| Disabled  | Neutral |

---

# Background Colors

Jenis Background:

* App Background
* Surface Background
* Card Background
* Modal Background
* Sidebar Background

Background harus memiliki kontras yang cukup dengan teks.

---

# Text Colors

Kategori teks:

* Primary Text
* Secondary Text
* Disabled Text
* Link
* Error Text
* Success Text

---

# Border Colors

Digunakan untuk:

* Input
* Table
* Card
* Divider
* Modal

Border tidak boleh lebih dominan daripada konten utama.

---

# Color Tokens

Penamaan token:

```text id="color01"
primary-500

neutral-100

success-500

warning-500

error-500

info-500
```

Implementasi Frontend harus menggunakan Design Token, bukan nilai warna secara langsung.

---

# Accessibility

Seluruh kombinasi warna wajib:

* Memenuhi WCAG 2.1 Level AA.
* Memiliki rasio kontras yang memadai.
* Tetap terbaca pada Light dan Dark Theme.

Warna tidak boleh menjadi satu-satunya cara menyampaikan informasi.

---

# Best Practices

* Hindari penggunaan terlalu banyak warna utama.
* Gunakan warna semantik sesuai maknanya.
* Jangan menggunakan warna hardcoded pada komponen.
* Gunakan Design Token di seluruh aplikasi.
* Pertahankan konsistensi antar platform.

---

# Related Documents

* README.md
* typography.md
* theme.md
* accessibility.md

---

# Acceptance Criteria

* Seluruh warna menggunakan Design Token.
* Warna semantik digunakan secara konsisten.
* Mendukung Light dan Dark Theme.
* Memenuhi standar Accessibility.
* Color System menjadi acuan resmi penggunaan warna pada LIM Digital Platform.
