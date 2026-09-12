# Navigation

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `navigation.md`

**Version:** 3.1

**Status:** Approved

Perubahan pada 3.2: navbar (desktop & mobile) memakai kapsul mengambang **solid** — chrome tidak lagi glass (`bg-background border border-border/40 shadow-sm`); kaca dipertahankan hanya untuk kartu/widget konten. Bentuk kapsul `rounded-full` → `w-full rounded-none` saat scroll tetap sama (transisi `[width,border-radius,...]` 300ms `ease-in-out`); menu berbentuk pill dengan indikator aktif `bg-primary/10 text-primary`; hamburger bulat oranye.

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

> **⚠️ Dua lapisan berbeda status untuk Situs Publik.** Per `PRODUCT.md`, situs publik dibangun ulang total "kecuali menu navigasi yang dipertahankan". Dokumen ini memuat dua jenis informasi dengan status berbeda:
> - **Dipertahankan (tetap mengikat):** Information Architecture — daftar menu (`Public Navigation`, `Profile Navigation`, jumlah maksimal lima menu utama) dan struktur URL.
> - **Situs Publik (implemented):** navbar kapsul **solid** dipertahankan (kaca dihapus dari chrome; `bg-background border border-border/40 shadow-sm`), dropdown Profil: Tentang, Visi-Misi, Pengurus Pusat) + item top-level **Bidang** (`/profil/bidang`), Artikel, Kontak; Falak & Media tidak di menu atas. Menu kanan: ThemeToggle + Admin. Detail IA final di `DESIGN.md` §4; warna mengikuti `app/globals.css`.

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
    ├── Tim Wajib Khidmah  ← + link "Permohonan" (rute wajib-khidmah/permohonan)
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

- Kapsul mengambang: `sticky top-0 z-50` (wrapper transparan) berisi kapsul **solid** `border border-border/40 bg-background shadow-sm` — chrome tidak memakai glass.
- Di atas halaman: kapsul `mx-auto max-w-5xl rounded-full` dengan wrapper `px-4 pt-3 sm:pt-4`.
- Saat scroll (> 8px): kapsul melebar penuh `w-full rounded-none border-x-0` (full-display dari tepi ke tepi), wrapper padding hilang; transisi `duration-300 ease-in-out`, dimatikan untuk reduced-motion.
- Isi kapsul: `flex items-center justify-between px-4 py-2 sm:px-6 sm:py-2.5`.
- Logo: tampil polos dengan warna aslinya (tanpa lingkaran, tanpa invert di dark mode).
- Menu berbentuk pill `rounded-full px-4 py-2 text-sm`; aktif `bg-primary/10 font-medium text-primary`; idle `text-foreground/70 hover:bg-accent hover:text-primary`.
- Hamburger mobile: bulat `rounded-full bg-primary/10 p-2 text-primary`.
- Typography: Fraunces (kelas `font-heading`), tanpa font mixing.

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

 • Tim Wajib Khidmah (+ Permohonan)

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
- Wordmark memakai Fraunces `tracking-tight`.

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

Implementasi breadcrumb admin (`components/admin/navigation/breadcrumb.tsx`):

- Merender `<nav aria-label="Breadcrumb">` berisi trail `Link` — BUKAN judul halaman; setiap halaman admin memiliki `h1` sendiri melalui `PageHeader`.
- Label segmen mengikuti kamus resmi di komponen (mis. `incoming-mail` → "Surat Masuk"); segmen dinamis (`[id]`, UUID) ditampilkan sebagai "Detail".
- Jangan menambahkan `h1` duplikat di header layout.

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

/profil/bidang/tim-wajib-khidmah/permohonan  ← proposal, belum final

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

# Rute Belum Terpetakan — Resolusi

`PRODUCT.md` mengonfirmasi rute publik *layanan falak* dan *wajib-khidmah/permohonan* yang sebelumnya tidak punya slot di Primary Navigation. Keputusan: keduanya menjadi **sub-menu di bawah menu existing**, bukan menu utama baru — aturan "Maximum Five Primary Menus" tidak berubah.

Penempatan (lihat `Profile Navigation` di atas):

- **Layanan Falak** → entri baru sejajar Tentang LIM/Visi & Misi/Pengurus Pusat di dropdown **Profil**, dengan sub-item Jadwal Shalat, Arah Kiblat, Kalender Hijriah, Hisab, Rukyat, Gerhana.
- **Wajib-khidmah/permohonan** → nempel pada entri **Bidang → Tim Wajib Khidmah** yang sudah ada, sebagai link "Permohonan" di halaman tersebut.

**⚠️ Ini proposal, belum keputusan final** — penempatan "Layanan Falak" di dalam Profil dipilih karena Profil satu-satunya menu existing yang sudah berstruktur dropdown multi-entri, bukan karena kecocokan makna. Perlu diperhatikan: pengguna yang mencari "jadwal shalat hari ini" (kasus pakai frekuensi tinggi, jamaah pengguna falak) kemungkinan tidak akan menduga fitur itu ada di bawah menu "Profil" (yang secara konvensi berarti "Tentang Kami"). Pertimbangkan alternatif seperti CTA/shortcut falak di Beranda atau navbar sebagai pelengkap, bukan pengganti, penempatan struktural ini.

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