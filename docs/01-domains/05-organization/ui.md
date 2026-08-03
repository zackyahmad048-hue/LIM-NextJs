# Organization UI

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) pada Domain Organization.

UI Organization digunakan untuk mengelola struktur organisasi, wilayah, cabang, bidang, jabatan, periode kepengurusan, dan data pengurus.

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
├── Regions
├── Branches
├── Departments
├── Positions
├── Management Periods
└── Management
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

# Region

## List View

Kolom:

- Province
- Regency / City
- District
- Village
- Action

Fitur:

- Search
- Filter
- Pagination

---

## Form

Field:

```text id="orgui03"
Province

Regency / City

District

Village
```

---

# Branch

## List View

Kolom:

- Code
- Branch Name
- Region
- Status
- Action

Fitur:

- Search
- Filter
- Pagination

---

## Form

Field:

```text id="orgui04"
Organization

Region

Branch Code

Branch Name

Address

Status
```

---

# Department

## List View

Kolom:

- Department
- Description
- Sort Order
- Action

---

## Form

Field:

```text id="orgui05"
Department Name

Description

Sort Order
```

---

# Position

## List View

Kolom:

- Position
- Department
- Level
- Sort Order
- Action

---

## Form

Field:

```text id="orgui06"
Department

Position Name

Level

Sort Order
```

---

# Management Period

## List View

Kolom:

- Period Name
- Start Date
- End Date
- Status
- Action

---

## Form

Field:

```text id="orgui07"
Period Name

Start Date

End Date

Status
```

---

# Management

## List View

Kolom:

- User
- Branch
- Position
- Period
- Status
- Action

Fitur:

- Search
- Filter
- Pagination

---

## Form

Field:

```text id="orgui08"
User

Branch

Position

Management Period

Start Date

End Date

Status
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

```text id="orgui09"
Data gagal dimuat.

Silakan coba beberapa saat lagi.
```

---

# Delete Confirmation

Sebelum menghapus data:

```text id="orgui10"
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
