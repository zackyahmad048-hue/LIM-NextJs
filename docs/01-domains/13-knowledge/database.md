# Knowledge Database

**Project:** LIM Digital Platform

**Domain:** Knowledge

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan struktur database pada Domain Knowledge.

Domain Knowledge menyimpan seluruh artikel, dokumentasi, SOP, FAQ, kategori, tag, riwayat review, dan arsip pengetahuan organisasi.

---

# Overview

Domain Knowledge menjadi pusat penyimpanan seluruh Knowledge Base organisasi.

Seluruh domain dapat menggunakan Knowledge sebagai sumber referensi sesuai hak akses.

---

# Entity Relationship

```text id="knwdb01"
Knowledge
     │
     ├─────────────┬──────────────┬──────────────┐
     ▼             ▼              ▼              ▼
Category         Tag          Review        Archive
     │
     ▼
Media
```

---

# Main Tables

## knowledge

Menyimpan data utama Knowledge.

| Field       | Type      | Description       |
| ----------- | --------- | ----------------- |
| id          | UUID      | Primary Key       |
| categoryId  | UUID      | Kategori          |
| authorId    | UUID      | Penulis           |
| title       | String    | Judul             |
| slug        | String    | URL Slug          |
| content     | Long Text | Isi Artikel       |
| type        | Enum      | Jenis Konten      |
| status      | Enum      | Status            |
| publishedAt | Timestamp | Tanggal Publikasi |
| createdAt   | Timestamp | Dibuat            |
| updatedAt   | Timestamp | Diubah            |
| deletedAt   | Timestamp | Soft Delete       |

---

## knowledge_category

Kategori Knowledge.

| Field       | Type   |
| ----------- | ------ |
| id          | UUID   |
| parentId    | UUID   |
| name        | String |
| slug        | String |
| description | Text   |

---

## knowledge_tag

Tag Knowledge.

| Field | Type   |
| ----- | ------ |
| id    | UUID   |
| name  | String |
| slug  | String |

---

## knowledge_tag_map

Relasi antara Knowledge dan Tag.

| Field       | Type |
| ----------- | ---- |
| knowledgeId | UUID |
| tagId       | UUID |

---

## knowledge_review

Riwayat review konten.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| knowledgeId | UUID      |
| reviewerId  | UUID      |
| status      | Enum      |
| note        | Text      |
| reviewedAt  | Timestamp |

---

## knowledge_archive

Arsip Knowledge.

| Field       | Type      |
| ----------- | --------- |
| id          | UUID      |
| knowledgeId | UUID      |
| archivedBy  | UUID      |
| archivedAt  | Timestamp |

---

# Relationships

| Source    | Relation | Target    |
| --------- | -------- | --------- |
| Category  | 1 : N    | Knowledge |
| User      | 1 : N    | Knowledge |
| Knowledge | N : N    | Tag       |
| Knowledge | 1 : N    | Review    |
| Knowledge | 1 : 1    | Archive   |
| User      | 1 : N    | Review    |

---

# Indexes

```text id="knwdb02"
knowledge.slug

knowledge.title

knowledge.status

knowledge.type

knowledge_category.slug

knowledge_tag.slug
```

---

# Constraints

## Knowledge

- slug wajib unik.
- title wajib.
- categoryId wajib.
- authorId wajib.

---

## Category

- slug wajib unik.

---

## Tag

- slug wajib unik.

---

## Review

- reviewerId wajib.
- status wajib.

---

# Soft Delete

Menggunakan Soft Delete:

- knowledge
- knowledge_category
- knowledge_tag

Review dan Archive bersifat permanen.

---

# Status Enum

## Knowledge

```text id="knwdb03"
Draft

Review

Published

Archived

Rejected
```

---

## Content Type

```text id="knwdb04"
Article

Documentation

SOP

FAQ

Tutorial

Reference

Announcement

Policy
```

---

# Database Rules

- Slug harus unik.
- Satu Knowledge dapat memiliki banyak Tag.
- Review tersimpan sebagai riwayat permanen.
- Arsip bersifat Read Only.
- Seluruh akses database menggunakan Repository Pattern.

---

# Future Tables

```text id="knwdb05"
knowledge_version

knowledge_comment

knowledge_rating

knowledge_attachment

knowledge_search_log
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

- Struktur database mendukung seluruh lifecycle Knowledge.
- Slug selalu unik.
- Relasi Knowledge, Category, dan Tag konsisten.
- Arsip bersifat permanen (Read Only).
- Seluruh akses database menggunakan Repository Pattern.
