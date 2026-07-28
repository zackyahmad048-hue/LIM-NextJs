# Media Business Rules

**Project:** LIM Digital Platform

**Domain:** Media

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Media.

Domain Media menjadi layanan penyimpanan terpusat untuk seluruh file yang digunakan oleh LIM Digital Platform.

---

# General Rules

* Seluruh file disimpan melalui Domain Media.
* Setiap file memiliki ID unik.
* File hanya disimpan satu kali.
* Domain lain hanya menyimpan referensi `mediaId`.
* Seluruh aktivitas dicatat pada Audit Log.

---

# File Types

Media mendukung:

* Image
* Document
* PDF
* Spreadsheet
* Presentation
* Video
* Audio
* Archive

Format dapat ditambah melalui konfigurasi sistem.

---

# Upload Rules

Setiap file wajib memiliki:

* File Name
* MIME Type
* File Size
* Storage Path
* Uploaded By
* Uploaded At

Upload hanya dapat dilakukan oleh pengguna yang memiliki permission.

---

# Storage Rules

* File disimpan pada Storage Provider.
* Metadata disimpan di Database.
* File tidak disimpan sebagai BLOB di database.

Storage dapat berupa:

* Local Storage
* S3 Compatible Storage
* Cloud Storage

---

# Folder Rules

File dapat dikelompokkan berdasarkan:

* Domain
* Folder
* Kategori

Contoh:

```text id="med01"
organization/

program/

certificate/

letter/

cms/
```

---

# Thumbnail Rules

Thumbnail otomatis dibuat untuk:

* JPG
* PNG
* WEBP

Thumbnail tidak dibuat untuk dokumen non-gambar.

---

# Preview Rules

Preview didukung untuk:

* Image
* PDF
* Video

File lain menggunakan proses download.

---

# Reference Rules

File dapat digunakan oleh lebih dari satu domain.

Penghapusan file hanya diperbolehkan apabila tidak lagi direferensikan oleh domain lain.

---

# Archive Rules

File dapat diarsipkan.

File arsip:

* Tidak dapat diubah.
* Tetap dapat digunakan sebagai referensi.

---

# Delete Rules

Menggunakan Soft Delete.

File tidak dapat dihapus apabila:

* Masih digunakan domain lain.
* Menjadi logo organisasi.
* Menjadi template.
* Menjadi lampiran aktif.

---

# Audit Rules

Aktivitas berikut wajib dicatat:

* Upload File
* Update Metadata
* Download File
* Preview File
* Archive File
* Restore File
* Delete File

---

# Security Rules

* Authentication wajib.
* Permission wajib.
* File pribadi hanya dapat diakses oleh pengguna yang memiliki hak.
* URL file mengikuti kebijakan keamanan storage.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

* File hanya disimpan satu kali.
* Metadata selalu tersedia.
* File tidak dapat dihapus apabila masih direferensikan.
* Seluruh aktivitas tercatat pada Audit Log.

---

# Related Documents

* README.md
* workflow.md
* database.md
* api.md
* permissions.md
* validation.md
* ui.md
* roadmap.md
