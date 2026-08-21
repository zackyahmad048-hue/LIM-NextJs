# CMS Database

**Project:** LIM Digital Platform

**Domain:** Content Management System (CMS)

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan struktur database yang digunakan oleh Domain CMS.

Domain CMS bertanggung jawab menyimpan seluruh data konten yang dipublikasikan pada Website dan Mobile Application.

---

# Overview

CMS memiliki tabel utama untuk mengelola:

- Post
- Page
- Category
- Tag

Seluruh tabel mengikuti standar database LIM Digital Platform.

---

# Entity Relationship

```text id="cmsdb01"
Category
    │
    │ 1..N
    ▼
Post
    ▲
    │ N..N
    │
Tag

Page
```

---

# Main Tables

## post

Menyimpan artikel dan berita.

Kolom utama:

| Field       | Type      | Description                  |
| ----------- | --------- | ---------------------------- |
| id          | UUID      | Primary Key                  |
| title       | String    | Judul                        |
| slug        | String    | URL unik                     |
| excerpt     | Text      | Ringkasan                    |
| content     | Long Text | Isi artikel                  |
| categoryId  | UUID      | Relasi Category              |
| status      | Enum      | Draft / Published / Archived |
| featured    | Boolean   | Konten unggulan              |
| publishedAt | Timestamp | Waktu publikasi              |
| createdAt   | Timestamp | Dibuat                       |
| updatedAt   | Timestamp | Diubah                       |
| deletedAt   | Timestamp | Soft Delete                  |

---

## page

Menyimpan halaman statis.

Contoh:

- Tentang Kami
- Sejarah
- Kontak
- Visi & Misi

Kolom hampir sama dengan `post`, tetapi tidak memiliki Category.

---

## category

Kategori artikel.

Kolom:

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| name        | String    |
| slug        | String    |
| description | Text      |
| createdAt   | Timestamp |
| updatedAt   | Timestamp |
| deletedAt   | Timestamp |

---

## tag

Tag artikel.

Kolom:

| Field     | Type      |
| --------- | --------- |
| id        | UUID      |
| name      | String    |
| slug      | String    |
| createdAt | Timestamp |
| updatedAt | Timestamp |

---

## post_tag

Pivot table.

Relasi:

```text id="cmsdb02"
Post

N

↓

post_tag

↑

N

Tag
```

---

# Relationships

| Source   | Relation    | Target |
| -------- | ----------- | ------ |
| Category | 1 : N       | Post   |
| Post     | N : N       | Tag    |
| Page     | Independent | -      |

---

# Indexes

Index wajib dibuat pada:

```text id="cmsdb03"
slug

status

publishedAt

categoryId

createdAt
```

---

# Constraints

## Post

- title wajib diisi.
- slug wajib unik.
- status wajib valid.

---

## Category

- name unik.
- slug unik.

---

## Tag

- name unik.
- slug unik.

---

# Soft Delete

Tabel yang menggunakan Soft Delete:

- post
- page
- category

Tag tidak menggunakan Soft Delete pada versi 1.0.

---

# Status Enum

```text id="cmsdb04"
Draft

Published

Archived
```

---

# Audit

Perubahan berikut dicatat:

- Create
- Update
- Publish
- Archive
- Restore
- Delete

---

# Database Rules

- Slug harus unik.
- Category tidak boleh dihapus apabila masih digunakan.
- Post dapat memiliki banyak Tag.
- Page tidak memiliki Category.
- Seluruh akses database melalui Repository.

---

# Future Tables

Versi berikutnya dapat menambahkan:

```text id="cmsdb05"
comment

revision

seo_metadata

content_history

content_translation
```

---

# Related Documents

- README.md
- business-rules.md
- workflow.md
- api.md
- permissions.md
- validation.md
- ui.md
- roadmap.md

---

# Acceptance Criteria

Database CMS dianggap selesai apabila:

- Struktur tabel mendukung Post, Page, Category, dan Tag.
- Relasi antar tabel konsisten.
- Seluruh slug unik.
- Soft Delete diterapkan sesuai aturan.
- Seluruh akses database menggunakan Repository Pattern.
