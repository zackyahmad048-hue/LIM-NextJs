# Falak Business Rules

**Project:** LIM Digital Platform

**Domain:** Falak

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Falak.

Domain Falak menjadi pusat layanan astronomi Islam yang menyediakan perhitungan, observasi, dan data falak untuk seluruh LIM Digital Platform.

---

# General Rules

- Seluruh perhitungan menggunakan algoritma yang telah divalidasi.
- Parameter perhitungan mengikuti konfigurasi organisasi.
- Seluruh hasil perhitungan dapat direproduksi menggunakan parameter yang sama.
- Seluruh aktivitas dicatat pada Audit Log.

---

# Prayer Time Rules

Jadwal salat dihitung berdasarkan:

- Lokasi
- Tanggal
- Metode Perhitungan
- Zona Waktu
- Elevasi

Perubahan metode perhitungan memengaruhi hasil jadwal salat.

---

# Qibla Rules

Arah kiblat dihitung berdasarkan:

- Koordinat lokasi.
- Koordinat Ka'bah.
- Model geodesi yang digunakan.

Hasil ditampilkan dalam satuan derajat.

---

# Hijri Calendar Rules

Kalender Hijriah dapat menggunakan:

- Hisab
- Rukyat
- Imkanur Rukyat
- Wujudul Hilal

Metode ditentukan melalui konfigurasi sistem.

---

# Hisab Rules

Perhitungan hisab meliputi:

- Ijtimak
- Tinggi Hilal
- Elongasi
- Umur Bulan
- Azimut
- Posisi Matahari
- Posisi Bulan

---

# Rukyat Rules

Data rukyat meliputi:

- Lokasi Observasi
- Observer
- Cuaca
- Hasil Observasi
- Dokumentasi

Data observasi tidak boleh diubah setelah dikonfirmasi.

---

# Eclipse Rules

Sistem dapat menghitung:

- Gerhana Matahari
- Gerhana Bulan

Berdasarkan parameter astronomi yang tersedia.

---

# Calculation Rules

Seluruh hasil perhitungan harus:

- Konsisten.
- Dapat diverifikasi.
- Menggunakan satuan standar internasional.

---

# Archive Rules

Data observasi dapat diarsipkan.

Data arsip:

- Read Only.
- Tetap dapat dijadikan referensi.

---

# Delete Rules

Menggunakan Soft Delete.

Data tidak dapat dihapus apabila:

- Menjadi referensi laporan.
- Digunakan sebagai data historis.
- Digunakan pada kalender resmi.

---

# Audit Rules

Aktivitas berikut wajib dicatat:

- Calculate Prayer Time
- Calculate Qibla
- Generate Hijri Calendar
- Save Hisab
- Save Rukyat
- Archive Observation
- Delete Data

---

# Security Rules

- Authentication wajib.
- Permission wajib.
- Parameter perhitungan tidak boleh dimanipulasi tanpa hak akses.
- Audit Log wajib aktif.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

- Seluruh perhitungan konsisten.
- Kalender Hijriah mengikuti metode yang dipilih.
- Data observasi bersifat permanen setelah dikonfirmasi.
- Arsip bersifat Read Only.
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
