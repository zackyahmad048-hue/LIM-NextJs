# Layout

**Project:** LIM Digital Platform

**Folder:** `08-design-system`

**Document:** `layout.md`

**Version:** 1.2

**Status:** Approved

Perubahan pada 1.2: penambahan aturan ritme section & spacing konsisten; penekanan grid sejajar untuk sub-content cards.

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

`PageContainer` (`components/admin/shared/page-container.tsx`) **tanpa batas lebar**: konten memenuhi seluruh area di kanan sidebar; padding horizontal ditangani pad oleh `<main>` (`p-4 md:p-6 lg:p-8`), `PageContainer` hanya menambah padding vertikal (`py-5 lg:py-8`) + gap agar inset kiri/kanan tidak dobel. Form yang butuh ukuran baca nyaman membatasi dirinya sendiri (misal `max-w-2xl` pada elemen form), bukan pada container.

---

# Section

Setiap section memiliki:

- Heading
- Description (Opsional)
- Content
- Action (Opsional)

## Ritme Section

- Vertikal antar section: `py-16 sm:py-20` (public) — konsisten di semua halaman.
- Separator section: hairline `h-px bg-border/60` dalam `max-w-6xl`.
- Heading section selalu diikuti description gap `gap-2` sebelum content.
- Jangan menumpuk dua section tanpa sekurang-kurangnya satu `py-16`.

---

# Grid

Mobile:

- 1 Kolom

Tablet:

- 2 Kolom

Desktop:

- 3–4 Kolom sesuai kebutuhan

## Grid Sejajar (Sub-content cards)

Untuk halaman profil & sub-content cards, wajib:

- Gap seragam: `gap-4 md:gap-6` (bukan `gap-3`/`gap-7` acak).
- Card dalam satu grid punya tinggi konsisten (`h-full` pada card skins).
- Grid alignment sama di seluruh halaman sejenis (profil, bidang, pengurus).
- Jangan campur kolom-count dalam satu viewport (mis. 2 lalu 3 di baris yang sama).

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

## Widget Responsive Sizing

Komponen widget (prayer schedule, dll.) harus di-scale untuk mobile:

| Breakpoint | Max-width | Padding |
| ---------- | --------- | ------- |
| Default (mobile) | `max-w-[18rem]` | `px-3 py-3` |
| `sm` | `max-w-[20rem]` | `sm:px-5 sm:py-4` |
| `lg` (desktop) | `lg:max-w-88` | `sm:px-5 sm:py-4` |

Font sizes: label `text-[10px] sm:text-[11px]`, values `text-xs sm:text-sm`, clock `text-lg sm:text-xl`.

---

# Acceptance Criteria

- Mobile First.
- Responsive.
- Konsisten.
- Mudah dikembangkan.