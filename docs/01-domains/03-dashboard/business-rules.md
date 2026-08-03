# Dashboard Business Rules

**Project:** LIM Digital Platform

**Domain:** Dashboard

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Dashboard.

Seluruh implementasi Dashboard harus mengikuti aturan yang dijelaskan pada dokumen ini.

---

# General Rules

Dashboard merupakan halaman informasi.

Dashboard tidak menjadi tempat melakukan transaksi maupun pengelolaan data.

Seluruh data yang ditampilkan berasal dari domain lain.

---

# Widget Rules

Dashboard terdiri dari beberapa widget.

Setiap widget bersifat independen.

Apabila salah satu widget gagal dimuat, widget lainnya tetap dapat ditampilkan.

---

# Permission Rules

Dashboard hanya dapat diakses oleh pengguna yang telah berhasil login.

Seluruh widget mengikuti Permission pengguna.

Pengguna tidak boleh melihat informasi yang tidak menjadi hak aksesnya.

---

# Statistics Rules

Statistik harus dihitung berdasarkan data aktif.

Data yang telah dihapus (Soft Delete) tidak dihitung.

Statistik diperbarui setiap kali Dashboard dimuat.

---

# Recent Activities Rules

Recent Activities hanya menampilkan aktivitas yang diizinkan untuk dilihat oleh pengguna.

Jumlah aktivitas dibatasi untuk menjaga performa sistem.

Urutan aktivitas berdasarkan waktu terbaru.

---

# Announcement Rules

Hanya Announcement dengan status **Published** yang ditampilkan.

Announcement yang telah melewati masa berlaku tidak ditampilkan.

---

# Quick Access Rules

Quick Access hanya menampilkan menu yang dapat diakses oleh pengguna.

Menu disusun berdasarkan prioritas sistem.

---

# System Information Rules

Informasi sistem hanya dapat diakses oleh Role yang memiliki izin.

Informasi sensitif seperti konfigurasi server, secret, atau detail database tidak boleh ditampilkan.

---

# Performance Rules

Dashboard harus:

- Memuat dengan cepat.
- Menggunakan query yang efisien.
- Tidak melakukan query yang berulang.
- Menggunakan pagination apabila diperlukan.

---

# Data Rules

Dashboard tidak menyimpan data sendiri.

Dashboard hanya membaca data dari domain lain melalui Service Layer.

Dashboard tidak boleh melakukan operasi Create, Update, Delete, atau Restore.

---

# Error Rules

Apabila widget gagal dimuat:

- Widget lain tetap ditampilkan.
- Sistem mencatat error pada log.
- Pengguna menerima pesan yang mudah dipahami.

---

# Audit Rules

Membuka Dashboard tidak menghasilkan Audit Log.

Audit hanya dicatat apabila terdapat aksi yang mengubah data pada domain lain.

---

# Security Rules

Dashboard wajib:

- Memeriksa Session pengguna.
- Memeriksa Permission sebelum memuat widget.
- Menyembunyikan informasi yang tidak memiliki hak akses.

---

# Acceptance Criteria

Business Rules Dashboard dianggap terpenuhi apabila:

- Dashboard hanya dapat diakses setelah login.
- Widget mengikuti Permission pengguna.
- Statistik hanya menghitung data aktif.
- Dashboard tidak mengubah data.
- Dashboard tetap dapat digunakan meskipun salah satu widget gagal dimuat.

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
