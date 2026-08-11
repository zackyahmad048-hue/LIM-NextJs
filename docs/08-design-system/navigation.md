# Navigation

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `navigation.md`

**Version:** 3.0

**Status:** Approved

Perubahan pada 3.0: logo tanpa lingkaran (warna asli), pill aktif oranye, bar blur, mobile menggunakan Sheet shadcn.

---

# Overview

Dokumen ini mendefinisikan standar navigasi pada LIM Digital Platform.

Navigation dirancang agar:

- Mudah dipahami pengguna.
- Konsisten di seluruh aplikasi.
- Mobile First.
- Responsive.
- Accessible.
- Mudah dikembangkan di masa depan.

Dokumen ini menjadi acuan implementasi seluruh navigasi Public Website maupun Admin Dashboard.

---

# Navigation Principles

Navigation LIM mengikuti prinsip berikut:

- Simple Navigation
- Consistent Experience
- Mobile First
- Responsive Design
- Accessible
- Maximum Five Primary Menus
- Clear Information Hierarchy

---

# Information Architecture

```text
LIM Digital Platform

├── Public Website
│
│   ├── Beranda
│   ├── Profil
│   ├── Artikel
│   ├── Media
│   └── Kontak
│
└── Admin Dashboard
    ├── Dashboard
    ├── Content
    ├── Homepage
    ├── Users
    ├── Roles
    ├── Settings
    └── ...
```

---

# Public Navigation

Primary Navigation terdiri dari lima menu utama.

```text
Beranda

Profil

Artikel

Media

Kontak
```

---

# Profile Navigation

Menu Profil menggunakan Navigation Menu pada Desktop dan Collapsible Menu pada Mobile.

```text
Profil

├── Tentang LIM
├── Visi & Misi
├── Pengurus Pusat
└── Bidang
    ├── Tim Wajib Khidmah
    ├── Safari Ramadan
    ├── Safari Dakwah Rutin
    ├── Penelitian & Pengembangan
    ├── Pesantren Ramadan
    ├── Dakwah Digital
    ├── Pendidikan & Kaderisasi
    └── Pemberdayaan Ekonomi
```

---

# Admin Navigation

Admin menggunakan Sidebar Navigation.

Struktur awal:

```text
Dashboard

Content
├── Posts
├── Categories
├── Pages
└── Media

Homepage
└── Hero

Users

Roles

Settings
```

Struktur ini dapat berkembang sesuai kebutuhan domain aplikasi.

---

# Desktop Navigation

Desktop menggunakan:

- Sticky Header
- Navigation Menu
- Dropdown Menu
- Hover Interaction

Detail visual:

- Bar: `sticky top-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-md`, konten `h-16 max-w-6xl`.
- Logo: tampil polos dengan warna aslinya (tanpa lingkaran, tanpa invert di dark mode).
- Menu aktif: pill oranye `bg-primary/10 text-primary`; idle `text-foreground/70 hover:bg-muted/70 hover:text-foreground`.
- Typography: Hanken Grotesk (kelas `font-display`), tanpa font mixing.

Contoh:

```text
Logo  Beranda  Profil ▼  Artikel  Media  Kontak  🌙  Admin   ← Navbar
```

---

# Mobile Navigation

Mobile menggunakan Sheet shadcn (side right, `w-80 sm:w-96`, overlay `bg-black/10` + blur-xs) dengan:

- Brand row di atas (logo warna asli + wordmark).
- Navigasi pill utama.
- Profil dan Bidang sebagai accordion (ChevronDown untuk Profil, ChevronRight untuk Bidang).
- Login Admin di bagian bawah.
- Sheet menutup otomatis setelah memilih menu.

Contoh:

```text
[Logo LIM Digital Platform]

Beranda

Profil ▾

Artikel

Media

Kontak

[Login Admin]
```

Saat Profil dibuka:

```text
▼ Profil

Tentang LIM

Visi & Misi

Pengurus Pusat

Bidang

 • Tim Wajib Khidmah

 • Safari Ramadan

 • Safari Dakwah Rutin

 • Penelitian & Pengembangan

 • Pesantren Ramadan

 • Dakwah Digital

 • Pendidikan & Kaderisasi

 • Pemberdayaan Ekonomi
```

---

# Navigation Components

| Component         | Desktop         | Mobile    |
| ----------------- | --------------- | --------- |
| Navbar            | Navigation Menu | Sheet     |
| Dropdown          | Hover           | Accordion |
| Sidebar           | Fixed           | Drawer    |
| Breadcrumb        | Yes             | Yes       |
| Footer Navigation | Yes             | Yes       |

---

# Responsive Behavior

| Device        | Navigation      |
| ------------- | --------------- |
| Mobile        | Sheet           |
| Tablet        | Sheet           |
| Desktop       | Navigation Menu |
| Large Desktop | Navigation Menu |

---

# Interaction Rules

## Logo

- Logo selalu mengarah ke Beranda.
- Logo tampil polos dengan warna aslinya — tanpa lingkaran, tanpa invert dark mode.
- Wordmark memakai Hanken Grotesk `tracking-tight`.

---

## Primary Menu

- Maksimal lima menu utama.
- Menu aktif memiliki indikator visual.
- Hover menampilkan Dropdown pada Desktop.
- Tap membuka submenu pada Mobile.

---

## Dropdown Menu

Desktop:

- Hover membuka submenu.
- Klik menuju halaman.

Mobile:

- Tap membuka submenu.
- Tap kembali menutup submenu.

---

## Drawer

Drawer harus:

- Menutup otomatis setelah memilih menu.
- Menutup saat area luar ditekan.
- Mendukung Swipe Back (jika memungkinkan).

---

## Sticky Header

Navbar tetap berada di bagian atas ketika pengguna melakukan scroll.

---

# Navigation States

Komponen navigasi wajib memiliki state berikut:

- Default
- Hover
- Active
- Focus
- Disabled (jika diperlukan)

---

# Breadcrumb

Breadcrumb digunakan pada:

- Halaman Admin
- Halaman Artikel
- Halaman Detail

Contoh:

```text
Beranda

>

Artikel

>

Judul Artikel
```

---

# URL Structure

Contoh URL Public:

```text
/

/

/profil/tentang

/profil/visi-misi

/profil/pengurus-pusat

/profil/bidang/tim-wajib-khidmah

/profil/bidang/safari-ramadan

/artikel

/media

/kontak
```

Contoh URL Admin:

```text
/admin

/admin/content/posts

/admin/content/categories

/admin/homepage/hero

/admin/users

/admin/settings
```

---

# Accessibility

Navigation wajib mendukung:

- Keyboard Navigation
- Screen Reader
- ARIA Attributes
- Focus Indicator
- WCAG AA Contrast

---

# Design Guidelines

Navigation wajib:

- Mobile First.
- Responsive.
- Mendukung Light Theme.
- Mendukung Dark Theme.
- Menggunakan Design Tokens.
- Menggunakan komponen shadcn/ui.

---

# Future Expansion

Menu berikut dapat ditambahkan tanpa mengubah struktur utama:

```text
Program

Agenda

Donasi

FAQ

Karier
```

---

# Related Documents

- README.md
- components.md
- responsive.md
- typography.md
- colors.md

---

# Acceptance Criteria

- Maksimal lima menu utama pada Public Website.
- Struktur Profil terdokumentasi.
- Admin menggunakan Sidebar Navigation.
- Responsive pada Mobile, Tablet, Desktop.
- Mendukung Light Mode dan Dark Mode.
- Memenuhi standar Accessibility.
- Menjadi acuan implementasi seluruh navigasi LIM Digital Platform.
