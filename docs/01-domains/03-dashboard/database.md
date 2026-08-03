# Dashboard Database

**Project:** LIM Digital Platform

**Domain:** Dashboard

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini menjelaskan kebutuhan database untuk Domain Dashboard.

Dashboard tidak memiliki tabel utama sendiri. Domain ini hanya membaca data dari domain lain untuk menyusun informasi yang ditampilkan kepada pengguna.

---

# Database Strategy

Dashboard menggunakan pendekatan **Read Only**.

Dashboard:

- Tidak membuat data.
- Tidak memperbarui data.
- Tidak menghapus data.
- Tidak memiliki tabel khusus.

Seluruh data diperoleh melalui Service Layer.

---

# Data Sources

Dashboard menggunakan data dari tabel berikut.

| Domain         | Table        |
| -------------- | ------------ |
| Authentication | user         |
| Authorization  | role         |
| Authorization  | permission   |
| CMS            | post         |
| Program        | program      |
| Certificate    | certificate  |
| Letter         | letter       |
| Media          | media        |
| Notification   | notification |
| Audit          | audit_log    |

Dashboard tidak menjadi pemilik data pada tabel tersebut.

---

# Data Usage

Dashboard hanya menggunakan data untuk:

- Statistik
- Ringkasan
- Aktivitas terbaru
- Quick Access
- Informasi sistem

Dashboard tidak boleh mengubah isi tabel sumber.

---

# Statistics Data

Statistik dihitung berdasarkan data aktif.

Contoh:

```text id="dbd15"
Total Users

↓

COUNT(user)

WHERE deletedAt IS NULL
```

Contoh lainnya:

- Total Program
- Total Surat
- Total Sertifikat
- Total Berita
- Total Media

---

# Recent Activities

Recent Activities berasal dari:

```text id="dbd16"
audit_log
```

Data diurutkan berdasarkan:

```text id="dbd17"
createdAt DESC
```

Jumlah data dibatasi untuk menjaga performa.

---

# Announcement

Announcement berasal dari tabel:

```text id="dbd18"
post
```

Filter:

- Status = Published
- Tanggal publikasi aktif
- deletedAt IS NULL

---

# Quick Access

Quick Access berasal dari:

- Role
- Permission

Dashboard menentukan menu yang ditampilkan berdasarkan permission pengguna.

Tidak ada penyimpanan konfigurasi Quick Access pada domain Dashboard.

---

# Soft Delete

Seluruh statistik hanya menghitung data dengan:

```text id="dbd19"
deletedAt IS NULL
```

Data yang telah dihapus tidak ikut dihitung.

---

# Database Access Rules

Dashboard wajib:

- Mengakses database melalui Repository.
- Menggunakan Service Layer.
- Tidak menjalankan query langsung dari UI.

---

# Performance

Query Dashboard harus:

- Menggunakan index.
- Menghindari N+1 Query.
- Menggunakan agregasi bila memungkinkan.
- Membatasi jumlah data yang ditampilkan.

---

# Future Database

Apabila diperlukan di masa depan, Dashboard dapat memiliki tabel sendiri untuk:

- Dashboard Preference
- Favorite Widget
- User Layout
- Widget Configuration

Versi 1.0 belum memerlukan tabel tersebut.

---

# Related Tables

Dashboard menggunakan referensi dari:

```text id="dbd20"
user

role

permission

post

program

letter

certificate

media

notification

audit_log
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

Database Dashboard dianggap sesuai apabila:

- Tidak memiliki tabel sendiri pada versi 1.0.
- Seluruh data berasal dari domain resmi.
- Dashboard hanya melakukan operasi baca (Read Only).
- Statistik menggunakan data aktif.
- Seluruh akses database melalui Repository dan Service Layer.
