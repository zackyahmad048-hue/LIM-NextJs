# Knowledge Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `knowledge-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Knowledge Domain**.

Knowledge Domain bertanggung jawab mengelola seluruh basis pengetahuan (Knowledge Base) organisasi, termasuk artikel, panduan, dokumentasi, FAQ, referensi, dan publikasi ilmiah yang digunakan sebagai media berbagi informasi.

Domain ini berbeda dengan CMS karena berfokus pada **knowledge management** dan bukan konten website.

---

# Objectives

Knowledge harus mampu:

- Mengelola Artikel.
- Mengelola Kategori.
- Mengelola Tag.
- Mengelola Lampiran.
- Mendukung Versioning.
- Mendukung Full Text Search.
- Mengelola Workflow Publikasi.

---

# Actors

| Actor               | Description                      |
| ------------------- | -------------------------------- |
| Super Administrator | Mengelola seluruh Knowledge Base |
| Knowledge Manager   | Mengelola artikel                |
| Editor              | Review artikel                   |
| Author              | Menulis artikel                  |
| User                | Membaca artikel sesuai hak akses |

---

# Functional Requirements

## Article Management

Mengelola:

- Create Article
- Update Article
- Delete Article
- Archive Article

---

## Category Management

Mengelola:

- Category
- Sub Category
- Topic

---

## Tag Management

Mendukung:

- Multiple Tags
- Search by Tag
- Recommendation

---

## Version Management

Mendukung:

- Version History
- Compare Version
- Restore Version

---

## Publication Workflow

Status:

```text id="know01"
Draft

↓

Review

↓

Published

↓

Archived
```

---

## Search

Mendukung:

- Full Text Search
- Filter
- Category Search
- Tag Search
- Author Search

---

# Non Functional Requirements

Knowledge harus:

- Response < 500 ms.
- Full Text Search.
- Highly Available.
- Audit Enabled.
- Versioning Enabled.

---

# Preconditions

- User telah Login.
- Permission sesuai.
- Artikel memenuhi validasi.

---

# Postconditions

- Artikel tersimpan.
- Search Index diperbarui.
- Audit Log dibuat.
- Notification dikirim (jika diperlukan).
- Domain Event diterbitkan.

---

# Main Flow

```text id="know02"
Request

↓

Authentication

↓

Authorization

↓

Validation

↓

Knowledge Service

↓

Repository

↓

Database

↓

Search Index

↓

Publish Event

↓

Response
```

---

# Alternative Flow

```text id="know03"
Save Draft

↓

Continue Editing

↓

Publish
```

---

# Exception Flow

- Artikel tidak ditemukan.
- Slug sudah digunakan.
- Kategori tidak ditemukan.
- Permission ditolak.
- Search Index gagal diperbarui.

---

# Sequence Diagram

```text id="know04"
Client

↓

Knowledge API

↓

Application

↓

Repository

↓

Database

↓

Search Engine

↓

Response
```

---

# State Diagram

```text id="know05"
Draft

↓

Review

↓

Published

↓

Archived
```

---

# Domain Model

Entity:

- KnowledgeArticle
- KnowledgeCategory
- KnowledgeTag
- KnowledgeVersion

Aggregate:

- Knowledge

Value Object:

- Slug
- PublicationStatus
- ArticleVersion

---

# Database Mapping

Tables:

```text id="know06"
knowledge_articles

knowledge_categories

knowledge_tags

knowledge_article_tags

knowledge_versions
```

---

# API Specification

| Method | Endpoint                       |
| ------ | ------------------------------ |
| GET    | /api/v1/knowledge              |
| GET    | /api/v1/knowledge/{id}         |
| POST   | /api/v1/knowledge              |
| PATCH  | /api/v1/knowledge/{id}         |
| DELETE | /api/v1/knowledge/{id}         |
| POST   | /api/v1/knowledge/{id}/publish |

---

# Validation Matrix

| Field      | Rule              |
| ---------- | ----------------- |
| title      | Required, Max 255 |
| slug       | Required, Unique  |
| content    | Required          |
| categoryId | Required          |
| tags       | Optional          |

---

# Permission Matrix

| Action         | Admin | Manager | Editor |  Author   | User |
| -------------- | :---: | :-----: | :----: | :-------: | :--: |
| View Published |  ✅   |   ✅    |   ✅   |    ✅     |  ✅  |
| Create         |  ✅   |   ✅    |   ✅   |    ✅     |  ❌  |
| Update         |  ✅   |   ✅    |   ✅   | Own Draft |  ❌  |
| Publish        |  ✅   |   ✅    |   ✅   |    ❌     |  ❌  |
| Archive        |  ✅   |   ✅    |   ❌   |    ❌     |  ❌  |

---

# Error Catalog

| Code     | Description               |
| -------- | ------------------------- |
| KNOW_001 | Article Not Found         |
| KNOW_002 | Duplicate Slug            |
| KNOW_003 | Category Not Found        |
| KNOW_004 | Invalid Status Transition |
| KNOW_005 | Search Index Failed       |

---

# Notification Matrix

| Event             | Notification  |
| ----------------- | ------------- |
| Article Submitted | Editor        |
| Article Published | Author        |
| Article Archived  | Administrator |

---

# Domain Events

```text id="know07"
KnowledgeCreated

KnowledgeUpdated

KnowledgePublished

KnowledgeArchived

KnowledgeVersionCreated
```

---

# Acceptance Test

- Artikel berhasil dibuat.
- Draft berhasil disimpan.
- Artikel berhasil dipublikasikan.
- Versioning berjalan.
- Search menghasilkan artikel yang sesuai.
- Audit Log tercatat.
- Domain Event diterbitkan.

---

# Performance Requirement

- Create Article < 500 ms.
- Search Article < 300 ms.
- Publish Article < 500 ms.
- Reindex < 5 detik.

---

# Security Requirement

- RBAC diterapkan.
- Audit Log aktif.
- Konten disanitasi sebelum dipublikasikan.
- Version History tidak dapat diubah.
- Seluruh endpoint menggunakan HTTPS.

---

# Acceptance Criteria

- Seluruh Business Rules Knowledge berjalan sesuai spesifikasi.
- Workflow Draft–Review–Published berjalan sesuai desain.
- Full Text Search dan Versioning berfungsi.
- Domain Event dan Audit Log aktif.
- Specification siap digunakan sebagai dasar implementasi Knowledge Domain.
