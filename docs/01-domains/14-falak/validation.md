# Falak Validation

**Project:** LIM Digital Platform

**Domain:** Falak

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan validasi pada Domain Falak.

Seluruh parameter perhitungan, data observasi, dan hasil astronomi wajib melalui proses validasi sebelum diproses oleh Business Rules.

---

# Validation Principles

- Server-side Validation
- Client-side Validation
- Fail Fast
- Consistent Error Messages

---

# Prayer Time Validation

## Location

- Wajib diisi.
- Latitude: -90 s/d 90.
- Longitude: -180 s/d 180.

---

## Date

- Wajib diisi.
- Menggunakan format ISO Date.

---

## Calculation Method

Harus salah satu metode yang didukung sistem.

Contoh:

- Kementerian Agama RI
- Muhammadiyah
- Umm Al-Qura
- Egyptian
- ISNA
- MWL

---

# Qibla Validation

- Latitude wajib valid.
- Longitude wajib valid.
- Koordinat tidak boleh kosong.

---

# Hijri Calendar Validation

- Tanggal Gregorian wajib diisi.
- Metode Hisab/Rukyat harus valid.
- Tahun Hijriah berada dalam rentang yang didukung sistem.

---

# Hisab Validation

Parameter wajib meliputi:

- Tanggal
- Lokasi
- Zona Waktu
- Metode Perhitungan

Seluruh parameter astronomi harus valid.

---

# Rukyat Validation

## Observation

- Lokasi observasi wajib diisi.
- Observer wajib aktif.
- Tanggal observasi wajib diisi.
- Cuaca wajib dipilih.

---

## Verification

Observasi hanya dapat diverifikasi apabila:

- Status = Draft.
- Data observasi lengkap.

---

## Confirmation

Observasi hanya dapat dikonfirmasi apabila:

- Status = Verified.
- Dilakukan oleh pengguna yang memiliki permission.

---

# Eclipse Validation

- Jenis gerhana wajib dipilih.
- Tanggal perhitungan wajib diisi.
- Parameter astronomi harus lengkap.

---

# Archive Validation

Data hanya dapat diarsipkan apabila:

- Status = Confirmed.

---

# Restore Validation

Data hanya dapat dipulihkan apabila:

- Status = Archived.

---

# Delete Validation

Data tidak dapat dihapus apabila:

- Menjadi data historis.
- Digunakan pada laporan resmi.
- Digunakan pada kalender yang telah dipublikasikan.

---

# Search Validation

- search ≤ 100 karakter.

---

# Pagination Validation

- page ≥ 1
- limit 1–100

---

# Error Messages

| Validation                   | Message                             |
| ---------------------------- | ----------------------------------- |
| Lokasi tidak valid           | Koordinat lokasi tidak valid.       |
| Metode tidak didukung        | Metode perhitungan tidak tersedia.  |
| Parameter belum lengkap      | Parameter astronomi belum lengkap.  |
| Observasi belum diverifikasi | Observasi belum dapat dikonfirmasi. |
| Data historis                | Data historis tidak dapat dihapus.  |

---

# Validation Flow

```text id="flkval01"
Request

↓

Validation

↓

Business Rules

↓

Calculation Engine

↓

Repository

↓

Database
```

---

# Acceptance Criteria

- Seluruh parameter tervalidasi.
- Perhitungan hanya menggunakan data yang valid.
- Observasi mengikuti alur Draft → Verified → Confirmed.
- Data historis tidak dapat dihapus.
- Seluruh validasi dijalankan sebelum Business Rules.
