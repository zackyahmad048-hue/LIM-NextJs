# Knowledge Business Rules

**Project:** LIM Digital Platform

**Domain:** Knowledge

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Knowledge.

Domain Knowledge menjadi pusat pengelolaan pengetahuan organisasi berupa artikel, dokumentasi, SOP, FAQ, dan referensi yang dapat diakses sesuai hak akses pengguna.

---

# General Rules

- Seluruh pengetahuan dikelola melalui Domain Knowledge.
- Setiap artikel memiliki ID unik.
- Seluruh perubahan dicatat pada Audit Log.
- Akses artikel mengikuti Role dan Permission.

---

# Content Types

Jenis konten meliputi:

- Article
- Documentation
- SOP
- FAQ
- Tutorial
- Reference
- Announcement
- Policy

Jenis konten dapat ditambahkan melalui konfigurasi sistem.

---

# Knowledge Status

Status konten:

```text id="knw01"
Draft

Review

Published

Archived

Rejected
```

---

# Category Rules

Setiap konten wajib memiliki minimal satu kategori.

Kategori dapat disusun secara hierarki (Parent–Child).

---

# Tag Rules

- Tag bersifat opsional.
- Satu konten dapat memiliki banyak tag.
- Tag digunakan untuk pencarian.

---

# Review Rules

Konten dapat dipublikasikan setelah melalui proses review.

Reviewer harus memiliki permission yang sesuai.

---

# Publish Rules

Konten hanya dapat dipublikasikan apabila:

- Status = Review.
- Judul tersedia.
- Isi artikel tersedia.
- Penulis valid.

---

# Search Rules

Pencarian mendukung:

- Judul
- Isi Artikel
- Tag
- Kategori
- Penulis

Menggunakan Full Text Search.

---

# Archive Rules

Konten yang telah diarsipkan:

- Bersifat Read Only.
- Tetap dapat dicari oleh Administrator.
- Tidak tampil pada daftar publik.

---

# Delete Rules

Menggunakan Soft Delete.

Konten tidak dapat dihapus apabila:

- Menjadi referensi domain lain.
- Digunakan sebagai SOP aktif.
- Digunakan sebagai dokumentasi sistem.

---

# Audit Rules

Aktivitas berikut wajib dicatat:

- Create Content
- Update Content
- Submit Review
- Approve Content
- Reject Content
- Publish Content
- Archive Content
- Delete Content

---

# Security Rules

- Authentication wajib.
- Permission wajib.
- Draft hanya dapat diakses oleh Author dan Reviewer.
- Audit Log wajib aktif.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

- Seluruh konten mengikuti lifecycle yang ditentukan.
- Kategori dan tag dikelola dengan benar.
- Publish hanya melalui proses review.
- Arsip bersifat Read Only.
- Seluruh aktivitas tercatat pada Audit Log.

---

# Related Documents

- README.md
- workflow.md
- database.md
- api.md
- permissions.md
- validation.md
- ui.md
- roadmap.md
