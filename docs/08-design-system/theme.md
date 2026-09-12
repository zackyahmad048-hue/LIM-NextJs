# Theme

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `theme.md`

**Version:** 1.2

**Status:** Approved

Perubahan pada 1.2: chrome solid — glass ditarik dari navbar/topbar/rail; kaca (`.glass`, `.glass-tint-*`) dipertahankan hanya untuk kartu/widget konten; `--glass-chrome-bg` dan `.glass-hard` dihapus.

Perubahan pada 1.1: radius seragam `rounded-xl` untuk semua content cards; penambahan shadow tokens (`--lim-shadow-*`) untuk kedalaman halus; refinement glass rules.

---

# Overview

Dokumen ini mendefinisikan standar Theme yang digunakan pada LIM Digital Platform.

Theme mengatur tampilan visual aplikasi secara konsisten melalui penggunaan Design Token, sehingga perubahan tema dapat dilakukan tanpa mengubah implementasi komponen.

LIM Digital Platform mendukung:

- Light Theme
- Dark Theme

Dengan kemungkinan penambahan tema khusus organisasi pada masa mendatang.

---

# Objectives

Theme bertujuan untuk:

- Menjaga konsistensi visual.
- Mendukung Light dan Dark Mode.
- Mempermudah implementasi Frontend.
- Meningkatkan kenyamanan pengguna.
- Mendukung Branding organisasi.

---

# Theme Principles

Seluruh Theme harus:

- Konsisten.
- Mudah dibaca.
- Mendukung Accessibility.
- Menggunakan Design Token.
- Tidak menggunakan Hardcoded Color.

---

# Supported Themes

## Light Theme

Karakteristik:

- Background terang.
- Kontras tinggi.
- Cocok untuk penggunaan umum.

---

## Dark Theme

Karakteristik:

- Background gelap.
- Mengurangi kelelahan mata pada kondisi minim cahaya.
- Tetap memenuhi standar kontras.

---

# Theme Tokens

Seluruh komponen menggunakan Theme Token.

Kategori Token:

- Background
- Surface
- Primary
- Secondary
- Border
- Text
- Icon
- Shadow
- Status Color

Contoh:

```text id="theme01"
background-primary

background-secondary

text-primary

text-secondary

border-default

surface-card

surface-modal
```

---

# Theme Switching

Pengguna dapat:

- Menggunakan Light Theme.
- Menggunakan Dark Theme.
- Mengikuti Theme Sistem (Auto).

Perubahan Theme harus diterapkan tanpa memuat ulang aplikasi.

---

# Glassmorphism ("Kaca Kristal")

Glassmorphism dipakai terbatas pada **kartu/widget konten**, bukan chrome/navigasi.

Permukaan yang boleh kaca:

- Kartu widget konten: hero shalat (`PrayerScheduleWidget`), tentang (about), kartu artikel (post-card), widget falak. Refrensi "taqwim hero" mengikuti penamaan sistem lama; sesuaikan bila komponen situs publik berganti nama pada rebuild.
- Kartu/nav highlight lain di situs publik yang memakai `.glass`/`.glass-tint-*` eksplisit.

Permukaan yang **wajib solid**:

- Chrome: navbar publik, topbar & rail sidebar admin, back-link login.
- Tabel, form, teks panjang/artikel, area data padat, kartu media gambar.

Implementasi:

- CSS-only via token `--glass-*` di `app/globals.css` (berlaku global publik & admin).
- `--glass-card-bg`: kartu translusen (~72%, pola Fey).
- `--glass-border`, `--glass-highlight`.
- `--glass-blur`: 20px desktop / 12px mobile.
- `--glass-saturate`: ~1.6–1.8 (menjaga keterbacaan teks di atas konten di belakangnya).
- Fallback `prefers-reduced-transparency` → permukaan menjadi solid.
- Transisi hanya `transform`/`opacity`/`color` (jalur kompositor).

---

# Shadow (Kedalaman)

Kedalaman = bayangan offset + blur lembut (kertas tertumpuk), **bukan halo tanpa offset**.

Token shadow:

| Token | Penggunaan |
| ----- | ---------- |
| `shadow-sm` (`--lim-shadow-sm`) | Kartu kecil, chip, elemen rapat |
| `shadow-md` (`--lim-shadow-md`) | Kartu konten, card lists — **standar** |
| `shadow-lg` (`--lim-shadow-lg`) | Overlay, modal, popover |

Aturan:

- Public site: `shadow-sm`/`shadow-md` lembut pada kartu konten.
- Admin CMS: `shadow-md` standar kartu, `shadow-lg` untuk modal/sheet.
- Dark mode: shadow otomatis lebih pekat (token `--lim-shadow-*` di `.dark`).
- Jangan gunakan shadow keras atau halo besar; shadow menggantikan border sebagai penanda elevasi.

---

# Radius

Radius seragam untuk seluruh platform:

| Level | Utility | Penggunaan |
| ----- | ------- | ---------- |
| `sm` | `rounded-sm` | Chip, badge, elemen sangat kecil |
| `md` | `rounded-md` | Input, button compact, nested control |
| `lg` | `rounded-lg` | Form, panel kecil, nested card |
| `xl` | `rounded-xl` | **Standar content cards** — public & admin |
| `2xl`/`full` | `rounded-2xl`/`rounded-full` | Chrome saja (navbar capsule `rounded-full`) |

Aturan:

- `rounded-xl` adalah **default** untuk semua content cards (public & admin).
- `rounded-2xl`+ dicadangkan hanya untuk chrome (navbar, hero overlay).
- Jangan bervariasi radius antar card serupa dalam satu section.

---

# Theme Scope

Theme diterapkan pada:

- Dashboard
- Sidebar
- Header
- Forms
- Buttons
- Cards
- Tables
- Charts
- Modals
- Notifications

Tidak boleh ada komponen yang mengabaikan Theme aktif.

---

# Branding

Theme mendukung identitas visual organisasi melalui:

- Logo
- Primary Color
- Favicon
- Login Background
- Splash Screen (Mobile)

Perubahan branding tidak mengubah struktur komponen.

---

# Responsive Behavior

Theme harus tampil konsisten pada:

- Desktop
- Tablet
- Mobile

Tidak boleh terjadi perubahan kontras yang mengurangi keterbacaan.

---

# Accessibility

Seluruh Theme wajib:

- Memenuhi WCAG 2.1 Level AA.
- Memiliki rasio kontras yang memadai.
- Tetap jelas pada Focus State.
- Tidak bergantung pada warna saja untuk menyampaikan informasi.

---

# Best Practices

- Gunakan Design Token untuk seluruh properti visual.
- Hindari warna langsung (Hardcoded).
- Uji seluruh komponen pada Light dan Dark Theme.
- Pastikan ilustrasi dan ikon tetap terlihat jelas.
- Pertahankan konsistensi antar platform.

---

# Related Documents

- README.md
- colors.md
- typography.md
- components.md
- accessibility.md

---

# Acceptance Criteria

- Mendukung Light dan Dark Theme.
- Seluruh komponen mengikuti Theme aktif.
- Theme menggunakan Design Token.
- Memenuhi standar Accessibility.
- Theme menjadi acuan resmi implementasi tampilan LIM Digital Platform.