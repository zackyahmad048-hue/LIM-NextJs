# CMS UI

**Project:** LIM Digital Platform

**Domain:** Content Management System (CMS)

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) untuk Domain CMS.

Seluruh tampilan CMS harus mengikuti Design System dan UX Guidelines LIM Digital Platform.

---

# Design Principles

UI CMS harus:

- Sederhana.
- Konsisten.
- Responsif.
- Mudah digunakan.
- Efisien.

---

# Navigation

Menu CMS berada pada Sidebar Admin.

```text
CMS
├── Dashboard
├── Posts
├── Pages
├── Categories
└── Tags
```

---

# CMS Dashboard

Dashboard CMS menampilkan ringkasan:

- Total Post
- Total Page
- Total Category
- Total Tag
- Draft
- Published
- Archived

---

# Posts

## List View

Menampilkan tabel:

| Kolom        |
| ------------ |
| Thumbnail    |
| Title        |
| Category     |
| Status       |
| Author       |
| Published At |
| Action       |

Fitur:

- Search
- Filter
- Sorting
- Pagination
- Bulk Action

---

## Create Form

Field:

```text
Title

Slug

Excerpt

Content Editor

Category

Tags

Featured Image

Status

Featured
```

Action:

- Save Draft
- Publish
- Cancel

---

## Edit Form

Sama seperti Create Form.

Tambahan:

- Last Updated
- Published Date
- Preview

---

## Detail View

Menampilkan:

- Informasi Post
- Preview
- Metadata
- Audit Information

---

# Pages

## List

Kolom:

- Title
- Slug
- Status
- Updated At
- Action

---

## Form

Field:

- Title
- Slug
- Content
- Status

---

# Categories

List:

- Name
- Slug
- Total Posts
- Status
- Action

Form:

- Name
- Slug
- Description

---

# Tags

List:

- Name
- Slug
- Total Posts
- Action

Form:

- Name
- Slug

---

# Search

Search tersedia pada:

- Posts
- Pages
- Categories
- Tags

---

# Filter

Posts dapat difilter berdasarkan:

- Status
- Category
- Author
- Published Date

---

# Empty State

Apabila belum ada data:

- Tampilkan ilustrasi.
- Tampilkan pesan.
- Tampilkan tombol **Tambah Data**.

---

# Loading State

Menggunakan:

- Skeleton
- Loading Spinner

---

# Error State

Gunakan Alert.

Contoh:

```text
Gagal memuat data.

Silakan coba kembali.
```

---

# Delete Confirmation

Sebelum menghapus data tampilkan dialog:

```text
Hapus Post?

Data akan dipindahkan ke Arsip.

[ Batal ]

[ Hapus ]
```

---

# Responsive

CMS dioptimalkan untuk:

- Desktop
- Tablet

Mobile hanya mendukung pengelolaan sederhana.

---

# Components

Komponen utama:

- Data Table
- Rich Text Editor
- Search Box
- Filter
- Pagination
- Modal
- Dialog
- Badge
- Toast
- Breadcrumb

---

# Accessibility

Seluruh komponen harus:

- Mendukung Keyboard Navigation.
- Memiliki Focus State.
- Memiliki Label.
- Menggunakan kontras warna sesuai Design System.

---

# Related Documents

- README.md
- business-rules.md
- workflow.md
- validation.md
- permissions.md
- roadmap.md

---

# Acceptance Criteria

UI CMS dianggap selesai apabila:

- Seluruh halaman konsisten.
- Mengikuti Design System.
- Mendukung Responsive Layout.
- Mudah digunakan oleh Administrator dan Editor.
