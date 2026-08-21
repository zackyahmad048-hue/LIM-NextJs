# CMS Specification

**Project:** LIM Digital Platform

**Folder:** `07-specifications`

**Document:** `cms-spec.md`

**Version:** 1.0

**Status:** Approved

---

# Overview

Dokumen ini mendefinisikan spesifikasi teknis implementasi **Content Management System (CMS) Domain**.

CMS bertanggung jawab mengelola seluruh konten publik LIM Digital Platform, termasuk halaman statis, berita, banner, menu, media, serta konfigurasi tampilan website.

CMS tidak mengelola Knowledge Base karena dikelola oleh **Knowledge Domain**.

---

# Objectives

CMS harus mampu:

- Mengelola Halaman (Pages).
- Mengelola Berita (News).
- Mengelola Banner.
- Mengelola Menu Navigasi.
- Mengelola Kategori Konten.
- Mengelola SEO Metadata.
- Mengelola Status Publikasi.

---

# Actors

| Actor               | Description                    |
| ------------------- | ------------------------------ |
| Super Administrator | Mengelola seluruh CMS          |
| CMS Administrator   | Mengelola konten               |
| Editor              | Membuat dan memperbarui konten |
| Author              | Menulis draft                  |
| Public User         | Melihat konten publik          |

---

# Functional Requirements

## Page Management

Mengelola:

- Create Page
- Update Page
- Delete Page
- Publish Page
- Archive Page

---

## News Management

Mengelola:

- News Article
- Category
- Featured News
- Publication Date

---

## Banner Management

Mengelola:

- Homepage Banner
- Promotion Banner
- Event Banner

---

## Navigation Menu

Mengelola:

- Main Menu
- Footer Menu
- External Link
- Internal Link

---

## SEO Management

Setiap konten mendukung:

- Meta Title
- Meta Description
- Slug
- Canonical URL
- Open Graph Metadata

---

## Publication Workflow

Status:

```text id="cms01"
Draft

↓

Review

↓

Published

↓

Archived
```

---

# Non Functional Requirements

CMS harus:

- Response < 500 ms.
- Mendukung Full Text Search.
- Mendukung Versioning.
- Audit Enabled.
- Highly Available.

---

# Preconditions

- User telah Login.
- Permission sesuai.
- Konten memenuhi validasi.

---

# Postconditions

- Konten tersimpan.
- Audit Log dibuat.
- Search Index diperbarui.
- Cache diperbarui.
- Domain Event diterbitkan.

---

# Main Flow

```text id="cms02"
Request

↓

Authentication

↓

Authorization

↓

Validation

↓

CMS Service

↓

Repository

↓

Database

↓

Publish Event

↓

Response
```

---

# Alternative Flow

```text id="cms03"
Draft Saved

↓

Continue Editing

↓

Publish Later
```

---

# Exception Flow

- Slug sudah digunakan.
- Konten tidak ditemukan.
- Permission ditolak.
- Status tidak valid.
- Media tidak tersedia.

---

# Sequence Diagram

```text id="cms04"
Client

↓

CMS API

↓

Application

↓

CMS Repository

↓

Database

↓

Event Bus
```

---

# State Diagram

```text id="cms05"
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

- Page
- News
- Banner
- Menu
- Category

Aggregate:

- CMSContent

Value Object:

- Slug
- SEO Metadata
- PublicationStatus

---

# Database Mapping

Tables:

```text id="cms06"
cms_pages

cms_news

cms_categories

cms_banners

cms_menus
```

---

# API Specification

| Method | Endpoint                       |
| ------ | ------------------------------ |
| GET    | /api/v1/cms/pages              |
| POST   | /api/v1/cms/pages              |
| PATCH  | /api/v1/cms/pages/{id}         |
| DELETE | /api/v1/cms/pages/{id}         |
| POST   | /api/v1/cms/pages/{id}/publish |
| GET    | /api/v1/cms/news               |

---

# Validation Matrix

| Field      | Rule              |
| ---------- | ----------------- |
| title      | Required, Max 255 |
| slug       | Required, Unique  |
| content    | Required          |
| status     | Enum              |
| categoryId | Required          |

---

# Permission Matrix

| Action         | Admin | Editor | Author | Public |
| -------------- | :---: | :----: | :----: | :----: |
| View Published |  ✅   |   ✅   |   ✅   |   ✅   |
| Create Draft   |  ✅   |   ✅   |   ✅   |   ❌   |
| Publish        |  ✅   |   ✅   |   ❌   |   ❌   |
| Delete         |  ✅   |   ❌   |   ❌   |   ❌   |

---

# Error Catalog

| Code    | Description               |
| ------- | ------------------------- |
| CMS_001 | Content Not Found         |
| CMS_002 | Duplicate Slug            |
| CMS_003 | Invalid Status Transition |
| CMS_004 | Category Not Found        |
| CMS_005 | Media Not Found           |

---

# Notification Matrix

| Event             | Notification  |
| ----------------- | ------------- |
| Content Published | Administrator |
| Content Rejected  | Author        |
| Content Archived  | Administrator |

---

# Domain Events

```text id="cms07"
ContentCreated

ContentUpdated

ContentPublished

ContentArchived

BannerUpdated
```

---

# Acceptance Test

- Halaman berhasil dibuat.
- Draft berhasil disimpan.
- Konten berhasil dipublikasikan.
- Banner berhasil diperbarui.
- Menu berhasil diperbarui.
- SEO Metadata tersimpan.
- Audit Log tercatat.
- Domain Event diterbitkan.

---

# Performance Requirement

- Create Content < 500 ms.
- Publish Content < 500 ms.
- Search Content < 300 ms.

---

# Security Requirement

- RBAC diterapkan.
- Audit Log aktif.
- HTML disanitasi sebelum disimpan.
- File Upload divalidasi.
- Seluruh endpoint menggunakan HTTPS.

---

# Acceptance Criteria

- Workflow Draft–Review–Published berjalan sesuai spesifikasi.
- Seluruh konten tervalidasi sebelum dipublikasikan.
- Search Index dan Cache diperbarui setelah publikasi.
- API mengikuti API Standard.
- Specification siap digunakan sebagai dasar implementasi CMS Domain.
