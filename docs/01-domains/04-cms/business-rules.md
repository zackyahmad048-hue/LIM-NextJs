# CMS Business Rules

**Project:** LIM Digital Platform

**Domain:** Content Management System (CMS)

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Content Management System (CMS).

Seluruh proses pembuatan, pengelolaan, publikasi, dan pengarsipan konten wajib mengikuti aturan dalam dokumen ini.

---

# General Rules

CMS merupakan domain yang mengelola seluruh konten publik.

Konten hanya dapat diubah oleh pengguna yang memiliki permission yang sesuai.

Setiap perubahan konten harus tercatat pada Audit Log.

---

# Content Types

CMS mengelola beberapa jenis konten:

- Post (Artikel/Berita)
- Page (Halaman Statis)
- Category
- Tag

Jenis konten baru dapat ditambahkan pada versi berikutnya tanpa mengubah struktur utama.

---

# Content Status

Setiap Post dan Page memiliki status berikut:

```text id="cms01"
Draft

↓

Published

↓

Archived
```

Keterangan:

- **Draft** : Konten belum dipublikasikan.
- **Published** : Konten dapat diakses publik.
- **Archived** : Konten disimpan dan tidak ditampilkan.

---

# Draft Rules

Konten Draft:

- Tidak tampil di Website.
- Tidak tampil di Mobile.
- Masih dapat diedit.
- Masih dapat dihapus.

---

# Published Rules

Konten Published:

- Ditampilkan pada Website.
- Ditampilkan pada Mobile (jika digunakan).
- Dapat diperbarui.
- Perubahan langsung berlaku setelah disimpan.

---

# Archived Rules

Konten Archived:

- Tidak tampil di publik.
- Tetap tersimpan.
- Dapat dipublikasikan kembali.

---

# Category Rules

Category:

- Wajib memiliki nama.
- Wajib memiliki slug unik.
- Tidak boleh memiliki nama yang sama.
- Dapat digunakan oleh banyak Post.

Category yang masih digunakan oleh Post tidak dapat dihapus.

---

# Tag Rules

Tag:

- Bersifat opsional.
- Dapat digunakan oleh banyak Post.
- Nama Tag harus unik.

---

# Slug Rules

Slug digunakan sebagai URL.

Aturan:

- Unik.
- Huruf kecil.
- Menggunakan tanda hubung (-).
- Tidak menggunakan karakter khusus.
- Tidak boleh sama dengan slug konten lain pada jenis yang sama.

Contoh:

```text id="cms02"
safari-ramadan-2027

pelatihan-imam

profil-organisasi
```

---

# Featured Content

Konten dapat ditandai sebagai Featured.

Aturan:

- Bersifat opsional.
- Hanya berlaku untuk konten Published.
- Digunakan pada halaman utama Website.

---

# SEO Rules

Setiap konten dapat memiliki metadata SEO:

- Meta Title
- Meta Description
- Meta Keywords
- Open Graph Image

Seluruh metadata bersifat opsional.

---

# Media Rules

Media yang digunakan pada konten berasal dari Domain Media.

CMS tidak menyimpan file secara langsung.

---

# Publish Rules

Konten hanya dapat dipublikasikan apabila:

- Judul tersedia.
- Slug tersedia.
- Isi konten tersedia.
- Status diubah menjadi Published.

---

# Delete Rules

Penghapusan menggunakan Soft Delete.

Konten yang dihapus:

- Tidak tampil di Website.
- Tidak tampil di Mobile.
- Masih dapat dipulihkan.

---

# Search Rules

Pencarian dilakukan berdasarkan:

- Judul
- Slug
- Category
- Tag
- Status

---

# Sorting Rules

Daftar konten dapat diurutkan berdasarkan:

- Tanggal Publikasi
- Tanggal Dibuat
- Judul
- Status

---

# Audit Rules

Aktivitas berikut wajib dicatat:

- Create Content
- Update Content
- Publish Content
- Archive Content
- Restore Content
- Delete Content

---

# Security Rules

CMS wajib:

- Memeriksa Session.
- Memeriksa Permission.
- Memvalidasi seluruh input.
- Menolak akses tanpa hak.

---

# Acceptance Criteria

Business Rules CMS dianggap terpenuhi apabila:

- Draft tidak tampil di publik.
- Published tampil di Website dan Mobile.
- Archived tidak tampil di publik.
- Slug selalu unik.
- Category yang digunakan tidak dapat dihapus.
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
