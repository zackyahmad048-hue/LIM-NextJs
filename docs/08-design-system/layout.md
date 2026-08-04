# Layout

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `layout.md`

**Version:** 1.0

**Status:** Approved

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

Gunakan container dengan lebar maksimum:

| Breakpoint                              | Max Width |
| --------------------------------------- | --------: |
| Default                                 |      100% |
| lg                                      |    1024px |
| xl                                      |    1280px |
| 2xl                                     |    1400px |
| `max-w-6xl` (pola utama situs & footer) |    1152px |

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
