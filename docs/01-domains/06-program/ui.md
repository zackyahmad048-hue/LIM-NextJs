# Program UI

**Project:** LIM Digital Platform

**Domain:** Program

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan standar antarmuka pengguna (UI) pada Domain Program.

UI Program digunakan untuk mengelola seluruh siklus kegiatan organisasi mulai dari pembuatan Program, pendaftaran peserta, pelaksanaan kegiatan, hingga dokumentasi.

---

# Design Principles

UI mengikuti prinsip:

- Simple
- Consistent
- Responsive
- Efficient
- User Friendly

Seluruh halaman mengikuti Design System LIM Digital Platform.

---

# Navigation

```text id="prgui01"
Program
├── Dashboard
├── Programs
├── Schedule
├── Participants
├── Committees
├── Attendance
└── Documentation
```

---

# Program Dashboard

Dashboard menampilkan ringkasan:

- Total Program
- Draft
- Published
- Registration Open
- On Going
- Completed
- Upcoming Programs
- Recent Activities

---

# Program List

## List View

Kolom:

- Code
- Program Name
- Type
- PIC
- Start Date
- End Date
- Status
- Action

Fitur:

- Search
- Filter
- Sorting
- Pagination
- Bulk Action

---

# Create Program

Field:

```text id="prgui02"
Program Code

Program Name

Program Type

Description

Person In Charge

Registration Open

Registration Close

Start Date

End Date

Status
```

Action:

- Save Draft
- Publish
- Cancel

---

# Edit Program

Field sama dengan Create Program.

Tambahan:

- Last Updated
- Audit Information
- Preview

---

# Schedule

## List View

Kolom:

- Title
- Venue
- Start Time
- End Time
- Action

Form:

```text id="prgui03"
Title

Venue

Start Time

End Time

Description
```

---

# Participants

## List View

Kolom:

- Name
- Registration Date
- Registration Status
- Attendance Status
- Action

Fitur:

- Search
- Filter
- Import
- Export

---

# Committee

## List View

Kolom:

- Name
- Role
- Status
- Action

Form:

```text id="prgui04"
User

Role

Status
```

---

# Attendance

## List View

Kolom:

- Participant
- Check In
- Check Out
- Attendance Status

Action:

- Check In
- Check Out

---

# Documentation

## Gallery View

Menampilkan:

- Thumbnail
- Title
- Upload Date
- Uploaded By

Action:

- Upload
- Preview
- Delete

---

# Search & Filter

Tersedia pada:

- Program
- Schedule
- Participant
- Committee
- Documentation

Filter berdasarkan:

- Status
- Program Type
- Date
- PIC

---

# Empty State

Jika data belum tersedia:

- Tampilkan ilustrasi.
- Tampilkan pesan.
- Tampilkan tombol **Buat Program** apabila pengguna memiliki permission.

---

# Loading State

Menggunakan:

- Skeleton Loading
- Spinner

---

# Error State

Gunakan Alert.

Contoh:

```text id="prgui05"
Data Program gagal dimuat.

Silakan coba kembali.
```

---

# Delete Confirmation

```text id="prgui06"
Hapus Program?

Program yang telah memiliki peserta tidak dapat dihapus.

[ Batal ]

[ Hapus ]
```

---

# Responsive Design

Mendukung:

- Desktop
- Tablet

Mobile mendukung:

- Melihat Program
- Registrasi
- Absensi
- Dokumentasi sederhana

---

# Components

Komponen standar:

- Data Table
- Search Box
- Filter Panel
- Date Picker
- Select
- Badge
- Card
- Modal
- Dialog
- Toast
- Pagination
- Calendar

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

UI Program dianggap selesai apabila:

- Seluruh modul memiliki halaman List dan Form.
- Dashboard menampilkan ringkasan Program.
- Layout konsisten.
- Mendukung Responsive Layout.
- Seluruh aksi mengikuti Permission pengguna.
