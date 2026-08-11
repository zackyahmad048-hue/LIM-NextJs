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

- Create (simpan sekali, status awal Draft) — pilih Nama/Jabatan Ketua & Sekretaris dari Pengurus Pusat, unggah dokumen, atur posisi QR
- Edit (tidak tersedia untuk surat Diarsipkan) — termasuk mengatur posisi QR pada halaman dokumen
- Tandai Terkirim (menerbitkan nomor & QR otomatis)
- Kembalikan ke Draft (dari Terkirim)
- Archive (dari Terkirim)
- Cetak / PDF
- Delete (Soft Delete)

## QR Penanda Tangan (Select Pengurus Pusat)

Field Nama/Jabatan Ketua & Sekretaris pada form Create/Edit surat keluar
menggunakan **komponen select** yang datanya diambil dari struktur
**Pengurus Pusat** (`modules/cms/queries/structure.query.ts`
→ `getCentralBoardSigners`):

- **Nama Ketua**: pengurus berposisi mengandung "Ketua" (Ketua Umum, Satu, …)
- **Nama Sekretaris**: pengurus berposisi mengandung "Sekretaris"
- Saat nama dipilih, **jabatan terisi otomatis** dari data pengurus
- Tidak ada input manual; bila struktur Pengurus Pusat kosong, tampil pesan
  peringatan dan select kosong

Field `senderName` ("Penanda Tangan") **dihapus** dari form Create/Edit.
Kolom DB dan tampilan list/halaman verifikasi tetap ada.

## QR Position Editor

Pada form Create/Edit surat keluar terdapat **QR Position Editor**
(`components/admin/secretariat/qr-position-editor.tsx`):

- Merender setiap halaman dokumen (via `/api/admin/secretariat/qr-editor`)
- Marker QR dapat diseret: **Ketua**, **Sekretaris** (per halaman), dan
  **Verifikasi** (semua halaman)
- Koordinat disimpan dalam **mm** dari pojok kiri-bawah halaman (sesuai
  koordinat pdf-lib), dikirim sebagai JSON via hidden input
  (`qrKetuaPosition`, `qrSekretarisPosition`, `qrVerifikasiPosition`)
- Tombol **Deteksi Simbol** (`detect=1`): menempatkan QR otomatis di atas
  kotak fiducial pada template
- Tombol **Reset posisi default** mengembalikan ke posisi `example-surat.pdf`

### Simbol Fiducial

Untuk penempatan presisi, user menempelkan **kotak solid 8×8 mm** pada
template surat di area tanda tangan. Warna menentukan peran:

- **Magenta `#FF00FF`** → QR Ketua
- **Cyan `#00FFFF`** → QR Sekretaris
- **Orange `#FF8C00`** → QR Verifikasi

Saat surat ditandai terkirim, `findFiducialPositions` (`fiducial.service.ts`)
merender halaman, mendeteksi **centroid** kotak tersebut, lalu QR (25 mm)
menutupi simbol **di tengah** — posisi corner digeser setengah ukuran QR
(`centerFiducialQr`) sehingga centroid simbol menjadi pusat QR. Prioritas
posisi: deteksi simbol → posisi tersimpan editor → default. Simbol tidak
terdeteksi → fallback ke posisi tersimpan/default.

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
