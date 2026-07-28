# Media UI

**Project:** LIM Digital Platform

**Domain:** Media

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) pada Domain Media.

UI digunakan untuk mengelola upload, penyimpanan, pencarian, preview, dan pengelolaan seluruh aset digital.

---

# Navigation

```text id="medui01"
Media
├── Dashboard
├── Files
├── Folders
├── Upload
├── Archive
└── Settings
```

---

# Dashboard

Menampilkan:

* Total Files
* Total Storage
* Images
* Documents
* Videos
* Recent Uploads
* Storage Usage

---

# Files

## List View

Kolom:

* Preview
* File Name
* Type
* Size
* Folder
* Uploaded By
* Uploaded At
* Status

Action:

* Preview
* Download
* Edit
* Archive
* Delete

Fitur:

* Search
* Filter
* Sorting
* Pagination

---

# Upload

Field:

```text id="medui02"
File

Folder

Description

Tags
```

Action:

* Upload
* Cancel

---

# Folder

Kolom:

* Folder Name
* Parent Folder
* Total Files

Action:

* Create
* Rename
* Delete

---

# Preview

Mendukung:

* Image Preview
* PDF Preview
* Video Preview

File lain menggunakan Download.

---

# Archive

Read Only.

Kolom:

* File Name
* Archived At
* Archived By

Action:

* View
* Restore

---

# Components

* Data Table
* File Upload
* Drag & Drop Upload
* Search
* Filter
* Pagination
* Thumbnail Grid
* Modal
* Dialog
* Toast
* Progress Bar

---

# Upload Progress

Menampilkan:

* Progress Upload
* File Size
* Upload Speed
* Upload Status

---

# States

* Empty State
* Loading State
* Uploading State
* Error State

---

# Responsive

* Desktop
* Tablet
* Mobile

---

# Acceptance Criteria

* Upload berjalan dengan Progress Bar.
* Preview tersedia untuk file yang didukung.
* UI responsif.
* Mengikuti Design System.
* Seluruh aksi mengikuti Permission.
