# Knowledge UI

**Project:** LIM Digital Platform

**Domain:** Knowledge

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) pada Domain Knowledge.

UI digunakan untuk mengelola artikel, dokumentasi, SOP, FAQ, kategori, tag, proses review, publikasi, pencarian, dan arsip Knowledge Base.

---

# Navigation

```text id="knwui01"
Knowledge
├── Dashboard
├── Articles
├── Categories
├── Tags
├── Review
├── Archive
└── Settings
```

---

# Dashboard

Menampilkan:

* Total Knowledge
* Draft
* Review
* Published
* Archived
* Recent Articles
* Most Viewed Articles

---

# Knowledge List

Kolom:

* Title
* Category
* Type
* Author
* Status
* Published At

Action:

* View
* Edit
* Submit Review
* Publish
* Archive
* Delete

Fitur:

* Search
* Filter
* Sorting
* Pagination

---

# Knowledge Editor

Field:

```text id="knwui02"
Title

Slug

Category

Tags

Content

Attachment

Status
```

Action:

* Save Draft
* Submit Review
* Publish
* Preview

Editor mendukung:

* Rich Text Editor
* Markdown
* Image Upload
* Attachment
* Auto Save

---

# Categories

Kolom:

* Name
* Parent Category
* Total Articles

Action:

* Create
* Edit
* Delete

---

# Tags

Kolom:

* Name
* Total Articles

Action:

* Create
* Edit
* Delete

---

# Review

Kolom:

* Article
* Reviewer
* Status
* Submitted At

Action:

* Approve
* Reject
* View Detail

---

# Archive

Read Only.

Kolom:

* Article
* Archived At
* Archived By

Action:

* View
* Restore

---

# Search

Mendukung pencarian berdasarkan:

* Title
* Content
* Category
* Tag
* Author
* Content Type

---

# Components

* Data Table
* Rich Text Editor
* Markdown Editor
* Search Box
* Filter Panel
* Tag Input
* File Upload
* Modal
* Dialog
* Toast
* Pagination
* Badge

---

# States

* Empty State
* Loading State
* Saving State
* Review State
* Error State

---

# Responsive

* Desktop
* Tablet
* Mobile

---

# Acceptance Criteria

* UI konsisten.
* Responsive.
* Editor mendukung Rich Text dan Markdown.
* Pencarian berjalan cepat.
* Seluruh aksi mengikuti Permission.
