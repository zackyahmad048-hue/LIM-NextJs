# Secretariat UI

**Project:** LIM Digital Platform

**Domain:** Secretariat

**Version:** 1.0

**Status:** Approved

---

# Navigation

```text
Secretariat
├── Dashboard
├── Incoming Mail
├── Outgoing Mail
├── Disposition
├── Documents
├── Agenda Book
└── Archive
```

---

# Dashboard

Menampilkan:

- Total Surat Masuk
- Total Surat Keluar
- Disposisi Aktif
- Dokumen Menunggu Persetujuan
- Arsip Terbaru

---

# Incoming Mail

List:

- Agenda Number
- Letter Number
- Sender
- Subject
- Received Date
- Status

Action:

- Create
- Edit
- Detail
- Delete

---

# Outgoing Mail

List:

- Nomor Surat (fullNumber) / "Belum bernomor"
- Penerima
- Perihal
- Tanggal Surat
- Status (Draft / Terkirim / Diarsipkan)

Action:

- Create (simpan sekali, status awal Draft)
- Edit (tidak tersedia untuk surat Diarsipkan)
- Tandai Terkirim (menerbitkan nomor & QR otomatis)
- Kembalikan ke Draft (dari Terkirim)
- Archive (dari Terkirim)
- Cetak / PDF
- Delete (Soft Delete)

---

# Penomoran Surat (Super Admin)

Halaman `/admin/system/penomoran` (khusus super admin):

- Format template (placeholder: `{seq}`, `{level}`, `{category}`, `{bulan}`, `{tahun}`)
- Jumlah digit nomor urut
- Periode kepengurusan (rentang tahun)
- Kode tingkat kepengurusan
- Koreksi manual nomor urut berikutnya per periode

---

# Disposition

List:

- Mail
- Assigned To
- Instruction
- Status

Action:

- Create
- Complete

---

# Documents

List:

- Document Number
- Type
- Title
- Status

Action:

- Create
- Edit
- Archive
- Restore

---

# Archive

Read Only.

Menampilkan:

- Archive Date
- Document
- Archived By

---

# Components

- Data Table
- Search
- Filter
- Pagination
- Form
- Date Picker
- File Upload
- Modal
- Dialog
- Toast

---

# States

- Empty State
- Loading State
- Error State

---

# Responsive

- Desktop
- Tablet
- Mobile (View Only)

---

# Acceptance Criteria

- UI konsisten.
- Responsive.
- Mengikuti Design System.
- Seluruh aksi mengikuti Permission.
