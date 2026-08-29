# Layout

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `layout.md`

**Version:** 1.1

**Status:** Approved

Perubahan pada 1.1: konten CMS tidak lagi dibatasi `max-w-7xl`; `PageContainer` admin melebar penuh mengikuti layar. Tabel container dipecah per konteks publik/admin.

---

# Overview

Dokumen ini mendefinisikan standar tata letak (Layout) seluruh halaman LIM Digital Platform.

Layout harus:

- Responsive
- Mobile First
- Konsisten
- Mudah dikembangkan

---

# Public Layout

```text
Header

↓

Main Content

↓

Footer
```

Digunakan pada:

- Beranda
- Profil
- Artikel
- Media
- Kontak

---

# Admin Layout

```text
Header

↓

Sidebar + Content

↓

Footer (Optional)
```

---

# Container

## Situs Publik

| Breakpoint                              | Max Width |
| --------------------------------------- | --------: |
| Default                                 |      100% |
| `max-w-6xl` (pola utama situs & footer) |    1152px |

Section mandiri (di luar hero) juga memakai `max-w-6xl` agar garis margin konsisten dengan navbar dan footer.

## Admin CMS

`PageContainer` (`components/admin/shared/page-container.tsx`) **tanpa batas lebar**: konten memenuhi seluruh area di kanan sidebar dengan padding `px-4 py-5 lg:px-6 lg:py-8`. Form yang butuh ukuran baca nyaman membatasi dirinya sendiri (misal `max-w-2xl` pada elemen form), bukan pada container.

---

# Section

Setiap section memiliki:

- Heading
- Description (Opsional)
- Content
- Action (Opsional)

---

# Grid

Mobile:

- 1 Kolom

Tablet:

- 2 Kolom

Desktop:

- 3–4 Kolom sesuai kebutuhan

---

# Spacing

Gunakan skala spacing Tailwind.

Hindari penggunaan nilai acak.

---

# Sticky Elements

Komponen berikut dapat menggunakan sticky:

- Navbar
- Sidebar
- Breadcrumb
- Action Bar

---

# Responsive Rules

- Tidak boleh horizontal scroll.
- Tidak ada elemen terpotong.
- Semua card fleksibel.
- Semua gambar responsive.

---

# Acceptance Criteria

- Mobile First.
- Responsive.
- Konsisten.
- Mudah dikembangkan.