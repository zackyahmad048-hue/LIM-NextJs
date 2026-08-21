# Design System

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `README.md`

**Version:** 2.0

**Status:** Approved

---

# Overview

Design System LIM Digital Platform merupakan kumpulan standar desain yang digunakan sebagai acuan dalam membangun seluruh antarmuka aplikasi.

Dokumen ini memastikan seluruh halaman memiliki tampilan yang:

- Konsisten
- Responsive
- Accessible
- Mudah dikembangkan
- Mendukung Light & Dark Theme

Seluruh implementasi UI wajib mengacu pada Design System ini.

---

# Objectives

Design System bertujuan untuk:

- Menjaga konsistensi antarmuka.
- Mempercepat proses pengembangan.
- Mengurangi duplikasi komponen.
- Mempermudah maintenance.
- Memberikan pengalaman pengguna yang seragam.

---

# Design Principles

Seluruh antarmuka LIM Digital Platform mengikuti prinsip berikut:

- Mobile First
- Responsive Design
- Accessibility (WCAG AA)
- Simple Interface
- Consistent Experience
- Reusable Components
- Performance Oriented

---

# Global UI Standards

Seluruh halaman wajib memenuhi standar berikut:

- Mobile First.
- Responsive pada Mobile, Tablet, Laptop, Desktop, dan Wide Screen.
- Mendukung Light Theme.
- Mendukung Dark Theme.
- Menggunakan Design Tokens.
- Menggunakan komponen shadcn/ui.
- Tidak menggunakan hardcoded color.
- Menggunakan spacing yang konsisten.
- Menggunakan typography yang konsisten.
- Menggunakan icon yang konsisten.

---

# Responsive Breakpoints

| Breakpoint | Device        |
| ---------- | ------------- |
| Default    | Mobile        |
| sm         | Small Mobile  |
| md         | Tablet        |
| lg         | Laptop        |
| xl         | Desktop       |
| 2xl        | Large Desktop |

Implementasi selalu dimulai dari **Mobile First**.

---

# Theme

Theme yang didukung:

- Light
- Dark
- System

Implementasi menggunakan:

- next-themes
- Tailwind CSS
- Design Tokens

---

# Color System

Seluruh warna menggunakan Design Tokens.

Contoh:

```tsx
bg - background;

text - foreground;

border - border;

text - muted - foreground;
```

Hindari penggunaan warna secara langsung.

Contoh yang tidak disarankan:

```tsx
bg - white;

text - black;

border - gray - 300;
```

---

# Component Standards

Seluruh komponen mengikuti aturan:

- Reusable
- Stateless jika memungkinkan
- Accessible
- Responsive
- Mudah diuji
- Konsisten dengan Design System

Komponen dasar menggunakan:

- shadcn/ui

---

# Navigation

Navigation mengikuti dokumen:

```
navigation.md
```

Standar:

- Maksimal lima menu utama.
- Responsive.
- Navigation Menu pada Desktop.
- Drawer pada Mobile.

---

# Typography

Typography mengikuti:

```
typography.md
```

Standar meliputi:

- Heading
- Body Text
- Caption
- Font Weight
- Line Height

---

# Spacing

Spacing mengikuti:

```
spacing.md
```

Menggunakan skala spacing Tailwind.

---

# Icons

Icons mengikuti:

```
icons.md
```

Standar:

- Lucide React
- Konsisten ukuran
- Konsisten warna

---

# Accessibility

Seluruh UI wajib memenuhi:

- Keyboard Navigation
- Focus Indicator
- Screen Reader Support
- ARIA Label
- WCAG AA Contrast

---

# Performance

Komponen harus:

- Lazy Load bila diperlukan.
- Menghindari render berulang.
- Menggunakan Server Component bila memungkinkan.
- Menggunakan Client Component hanya jika dibutuhkan.

---

# Documentation Structure

```text
08-design-system/

README.md

navigation.md

components.md

colors.md

typography.md

spacing.md

icons.md

responsive.md
```

---

# Related Documents

- 02-architecture
- 03-development
- 07-specifications
- 10-testing

---

# Acceptance Criteria

- Seluruh UI mengikuti Design System.
- Mendukung Mobile First.
- Mendukung Responsive Design.
- Mendukung Light & Dark Theme.
- Menggunakan Design Tokens.
- Menggunakan shadcn/ui.
- Memenuhi standar Accessibility.
- Menjadi acuan utama implementasi UI LIM Digital Platform.
