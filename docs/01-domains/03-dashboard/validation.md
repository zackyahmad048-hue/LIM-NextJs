# Dashboard Validation

**Project:** LIM Digital Platform

**Domain:** Dashboard

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Dashboard.

Dashboard tidak menerima input bisnis dari pengguna sehingga validasi hanya diterapkan pada request dan parameter yang digunakan untuk mengambil data.

---

# Validation Rules

Dashboard hanya menerima request yang telah:

- Terautentikasi.
- Memiliki Session yang valid.
- Memiliki Permission yang sesuai.

---

# Query Parameters

## limit

Tipe:

Number

Aturan:

- Minimum: 1
- Maximum: 100
- Default: 10

---

## page

Tipe:

Number

Aturan:

- Minimum: 1
- Default: 1

---

## period

Nilai yang diperbolehkan:

- today
- week
- month
- year

---

## search

Opsional.

Maksimal 100 karakter.

---

# Authentication Validation

Dashboard wajib memvalidasi:

- Session aktif.
- User aktif.
- Role aktif.

---

# Authorization Validation

Dashboard wajib memvalidasi Permission sebelum mengambil data.

---

# Data Validation

Dashboard hanya menampilkan:

- Data aktif.
- Data yang belum dihapus.
- Data yang boleh diakses pengguna.

---

# Error Response

Apabila validasi gagal:

- 401 Unauthorized
- 403 Forbidden
- 422 Validation Error

---

# Related Documents

- README.md
- business-rules.md
- permissions.md
- api.md

---

# Acceptance Criteria

- Seluruh request tervalidasi.
- Parameter tidak valid ditolak.
- Session wajib aktif.
- Permission wajib diperiksa.
