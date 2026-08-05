# Organization UI

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 2.0

**Status:** Draft

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) pada Domain Organization.

UI Organization digunakan untuk mengelola profil organisasi, cabang, kepengurusan (pengurus pusat, pengurus wilayah, pengurus cabang), dan data anggota.

---

# Design Principles

UI mengikuti prinsip:

- Simple
- Consistent
- Responsive
- Efficient
- User Friendly

Seluruh komponen mengikuti Design System LIM Digital Platform.

---

# Navigation

```text id="orgui01"
Organization
├── Organization Profile
├── Cabang
├── Pengurus Pusat
├── Pengurus Wilayah
├── Pengurus Cabang
└── Anggota
```

---

# Organization Profile

## List View

Menampilkan:

- Logo
- Nama Organisasi
- Singkatan
- Status

Action:

- Detail
- Edit

---

## Edit Form

Field:

```text id="orgui02"
Logo

Organization Name

Short Name

Address

Phone

Email

Website

Status
```

---

# Branch

## List View

Kolom:

- Nama Cabang
- Provinsi
- Kabupaten/Kota
- Status
- Action

Fitur:

- Search
- Filter
- Pagination

---

## Form

Field:

```text id="orgui03"
Organization

Nama Cabang

Provinsi

Kabupaten/Kota

Alamat (Opsional)

Status
```

---

# Central Board (Pengurus Pusat)

## List View

Kolom:

- User
- Organization
- Periode
- Status
- Action

Fitur:

- Search
- Filter
- Pagination

---

## Assign Form

Field:

```text id="orgui04"
User

Organization

Periode (2024-2029)
```

---

# Regional Board (Pengurus Wilayah)

## List View

Kolom:

- User
- Organization
- Provinsi
- Periode
- Status
- Action

Fitur:

- Search
- Filter
- Pagination

---

## Assign Form

Field:

```text id="orgui05"
User

Organization

Provinsi

Periode (2024-2029)
```

---

# Branch Board (Pengurus Cabang)

## List View

Kolom:

- User
- Organization
- Cabang
- Periode
- Status
- Action

Fitur:

- Search
- Filter
- Pagination

---

## Assign Form

Field:

```text id="orgui06"
User

Organization

Cabang

Periode (2024-2029)
```

---

# Member (Anggota)

## List View

Kolom:

- User
- Organization
- Cabang
- Periode
- Status
- Action

Fitur:

- Search
- Filter
- Pagination

---

## Add Form

Field:

```text id="orgui07"
User

Organization

Cabang

Periode (2024-2029)
```

---

# Search & Filter

Seluruh halaman mendukung:

- Search
- Filter
- Sorting
- Pagination

---

# Empty State

Apabila data belum tersedia:

- Tampilkan ilustrasi.
- Tampilkan pesan.
- Tampilkan tombol **Tambah Data** apabila pengguna memiliki permission.

---

# Loading State

Gunakan:

- Skeleton Loading
- Loading Spinner

---

# Error State

Gunakan Alert.

Contoh:

```text id="orgui08"
Data gagal dimuat.

Silakan coba beberapa saat lagi.
```

---

# Delete Confirmation

Sebelum menghapus data:

```text id="orgui09"
Hapus data ini?

Data yang masih digunakan oleh modul lain tidak dapat dihapus.

[ Batal ]

[ Hapus ]
```

---

# Responsive Design

Mendukung:

- Desktop
- Tablet

Mobile hanya mendukung tampilan data dan pengelolaan sederhana.

---

# Components

Komponen standar:

- Data Table
- Search Box
- Filter Panel
- Form
- Select
- Date Picker
- Badge
- Modal
- Dialog
- Toast
- Pagination

---

# Accessibility

Seluruh komponen wajib:

- Mendukung Keyboard Navigation.
- Memiliki Focus State.
- Menggunakan Label yang jelas.
- Mengikuti standar kontras warna.

---

# Related Documents

- README.md
- business-rules.md
- workflow.md
- database.md
- api.md
- permissions.md
- validation.md
- roadmap.md

---

# Acceptance Criteria

UI Organization dianggap selesai apabila:

- Seluruh modul memiliki halaman List dan Form.
- Layout konsisten.
- Mengikuti Design System.
- Mendukung Responsive Layout.
- Seluruh aksi mengikuti Permission pengguna.