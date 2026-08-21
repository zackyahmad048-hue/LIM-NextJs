# Program Business Rules

**Project:** LIM Digital Platform

**Domain:** Program

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis (Business Rules) pada Domain Program.

Domain Program menjadi pusat pengelolaan seluruh kegiatan organisasi mulai dari perencanaan, pelaksanaan, hingga penyelesaian kegiatan.

---

# General Rules

- Seluruh kegiatan organisasi harus terdaftar sebagai Program.
- Setiap Program memiliki identitas yang unik.
- Setiap Program dapat memiliki satu atau lebih agenda kegiatan.
- Seluruh aktivitas Program dicatat pada Audit Log.

---

# Program Rules

Setiap Program wajib memiliki:

- Nama Program
- Kode Program
- Jenis Program
- Penanggung Jawab
- Tanggal Mulai
- Tanggal Selesai
- Status

---

# Program Type Rules

Jenis Program ditentukan oleh organisasi.

Contoh:

```text id="prg01"
Safari Dakwah

Pelatihan

Seminar

Kajian

Musyawarah

Sosial

Lainnya
```

Jenis Program dapat ditambah melalui pengaturan sistem.

---

# Program Status

Status Program:

```text id="prg02"
Draft

Published

Registration Open

Registration Closed

On Going

Completed

Cancelled

Archived
```

---

# Status Rules

## Draft

- Belum dapat diakses peserta.
- Masih dapat diubah.

---

## Published

- Dapat dilihat pengguna.
- Belum tentu menerima pendaftaran.

---

## Registration Open

- Peserta dapat mendaftar.

---

## Registration Closed

- Pendaftaran ditutup.
- Data peserta tetap dapat dikelola.

---

## On Going

- Program sedang berlangsung.
- Absensi dapat dilakukan.

---

## Completed

- Program selesai.
- Sertifikat dapat diterbitkan.

---

## Cancelled

- Program dibatalkan.
- Tidak dapat menerima peserta.

---

## Archived

- Program menjadi arsip.
- Tidak tampil pada daftar aktif.

---

# Schedule Rules

Setiap Program minimal memiliki satu jadwal.

Jadwal terdiri dari:

- Tanggal
- Waktu Mulai
- Waktu Selesai
- Lokasi

---

# Participant Rules

Peserta:

- Dapat mendaftar sendiri.
- Dapat ditambahkan Administrator.
- Tidak boleh terdaftar dua kali pada Program yang sama.

---

# Committee Rules

Panitia:

- Ditentukan oleh Administrator.
- Dapat memiliki lebih dari satu anggota.
- Memiliki tugas sesuai perannya.

---

# Attendance Rules

Absensi hanya dapat dilakukan apabila:

- Program berstatus **On Going**.
- Peserta telah terdaftar.

---

# Documentation Rules

Dokumentasi Program meliputi:

- Foto
- Video
- Dokumen

Seluruh file menggunakan Domain Media.

---

# Certificate Rules

Sertifikat hanya dapat diterbitkan apabila:

- Program berstatus **Completed**.
- Peserta memenuhi syarat.
- Template sertifikat tersedia.

---

# Delete Rules

Program menggunakan Soft Delete.

Program tidak dapat dihapus apabila:

- Memiliki peserta.
- Memiliki sertifikat.
- Memiliki surat terkait.

---

# Audit Rules

Aktivitas berikut wajib dicatat:

- Create Program
- Update Program
- Publish Program
- Open Registration
- Close Registration
- Complete Program
- Cancel Program
- Delete Program

---

# Security Rules

- Seluruh perubahan memerlukan Authentication.
- Seluruh aksi memerlukan Permission.
- Peserta hanya dapat mengakses data Program yang menjadi haknya.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

- Program mengikuti siklus status yang ditentukan.
- Peserta tidak dapat mendaftar ganda.
- Sertifikat hanya diterbitkan setelah Program selesai.
- Seluruh perubahan tercatat pada Audit Log.

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
