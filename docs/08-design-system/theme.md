# Theme

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `theme.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan standar Theme yang digunakan pada LIM Digital Platform.

Theme mengatur tampilan visual aplikasi secara konsisten melalui penggunaan Design Token, sehingga perubahan tema dapat dilakukan tanpa mengubah implementasi komponen.

LIM Digital Platform mendukung:

* Light Theme
* Dark Theme

Dengan kemungkinan penambahan tema khusus organisasi pada masa mendatang.

---

# Objectives

Theme bertujuan untuk:

* Menjaga konsistensi visual.
* Mendukung Light dan Dark Mode.
* Mempermudah implementasi Frontend.
* Meningkatkan kenyamanan pengguna.
* Mendukung Branding organisasi.

---

# Theme Principles

Seluruh Theme harus:

* Konsisten.
* Mudah dibaca.
* Mendukung Accessibility.
* Menggunakan Design Token.
* Tidak menggunakan Hardcoded Color.

---

# Supported Themes

## Light Theme

Karakteristik:

* Background terang.
* Kontras tinggi.
* Cocok untuk penggunaan umum.

---

## Dark Theme

Karakteristik:

* Background gelap.
* Mengurangi kelelahan mata pada kondisi minim cahaya.
* Tetap memenuhi standar kontras.

---

# Theme Tokens

Seluruh komponen menggunakan Theme Token.

Kategori Token:

* Background
* Surface
* Primary
* Secondary
* Border
* Text
* Icon
* Shadow
* Status Color

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

* Menggunakan Light Theme.
* Menggunakan Dark Theme.
* Mengikuti Theme Sistem (Auto).

Perubahan Theme harus diterapkan tanpa memuat ulang aplikasi.

---

# Theme Scope

Theme diterapkan pada:

* Dashboard
* Sidebar
* Header
* Forms
* Buttons
* Cards
* Tables
* Charts
* Modals
* Notifications

Tidak boleh ada komponen yang mengabaikan Theme aktif.

---

# Branding

Theme mendukung identitas visual organisasi melalui:

* Logo
* Primary Color
* Favicon
* Login Background
* Splash Screen (Mobile)

Perubahan branding tidak mengubah struktur komponen.

---

# Responsive Behavior

Theme harus tampil konsisten pada:

* Desktop
* Tablet
* Mobile

Tidak boleh terjadi perubahan kontras yang mengurangi keterbacaan.

---

# Accessibility

Seluruh Theme wajib:

* Memenuhi WCAG 2.1 Level AA.
* Memiliki rasio kontras yang memadai.
* Tetap jelas pada Focus State.
* Tidak bergantung pada warna saja untuk menyampaikan informasi.

---

# Best Practices

* Gunakan Design Token untuk seluruh properti visual.
* Hindari warna langsung (Hardcoded).
* Uji seluruh komponen pada Light dan Dark Theme.
* Pastikan ilustrasi dan ikon tetap terlihat jelas.
* Pertahankan konsistensi antar platform.

---

# Related Documents

* README.md
* colors.md
* typography.md
* components.md
* accessibility.md

---

# Acceptance Criteria

* Mendukung Light dan Dark Theme.
* Seluruh komponen mengikuti Theme aktif.
* Theme menggunakan Design Token.
* Memenuhi standar Accessibility.
* Theme menjadi acuan resmi implementasi tampilan LIM Digital Platform.
