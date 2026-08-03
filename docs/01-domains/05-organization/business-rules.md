# Organization Business Rules

**Project:** LIM Digital Platform

**Domain:** Organization

**Version:** 1.0

**Status:** Approved

---

# Purpose

Dokumen ini mendefinisikan aturan bisnis pada Domain Organization.

Domain Organization menjadi sumber data resmi (Single Source of Truth) mengenai struktur organisasi yang digunakan oleh seluruh domain dalam LIM Digital Platform.

---

# General Rules

- Setiap organisasi memiliki identitas yang unik.
- Struktur organisasi mengikuti hierarki resmi organisasi.
- Seluruh domain menggunakan data organisasi dari domain ini.
- Data organisasi tidak boleh diduplikasi oleh domain lain.

---

# Organization Rules

Setiap organisasi wajib memiliki:

- Nama Organisasi
- Singkatan (Opsional)
- Logo
- Alamat
- Kontak
- Status

---

# Region Rules

Wilayah organisasi mengikuti struktur administratif.

Urutan wilayah:

```text id="org01"
Provinsi

↓

Kabupaten/Kota

↓

Kecamatan

↓

Desa/Kelurahan
```

Wilayah digunakan sebagai referensi Program, Secretariat, dan Letter.

---

# Branch Rules

Setiap Cabang:

- Memiliki nama unik.
- Berada pada satu wilayah.
- Memiliki status aktif atau nonaktif.
- Dapat memiliki banyak pengurus.

---

# Department Rules

Setiap Bidang:

- Memiliki nama unik.
- Berada di bawah organisasi.
- Digunakan sebagai referensi jabatan.

---

# Position Rules

Setiap Jabatan:

- Memiliki nama unik.
- Berada pada satu bidang.
- Memiliki urutan hierarki.

Contoh:

```text id="org02"
Ketua Umum

Sekretaris

Bendahara

Ketua Bidang

Anggota
```

---

# Management Rules

Setiap Pengurus:

- Terhubung dengan User (opsional).
- Memiliki Jabatan.
- Memiliki Cabang.
- Memiliki Masa Jabatan.

Satu User dapat memiliki lebih dari satu jabatan apabila diizinkan oleh organisasi.

---

# Management Period Rules

Masa kepengurusan memiliki:

- Tanggal Mulai
- Tanggal Selesai
- Status

Status:

```text id="org03"
Upcoming

Active

Completed
```

Hanya satu periode yang boleh berstatus **Active** untuk satu organisasi.

---

# Active Status Rules

Data aktif digunakan oleh:

- Dashboard
- Program
- Secretariat
- Letter
- Certificate

Data nonaktif tetap disimpan sebagai arsip.

---

# Delete Rules

Penghapusan menggunakan Soft Delete.

Data tidak dapat dihapus apabila masih digunakan oleh domain lain.

---

# Audit Rules

Aktivitas berikut dicatat:

- Create Organization
- Update Organization
- Create Branch
- Update Branch
- Create Position
- Update Position
- Assign Management
- Update Management

---

# Security Rules

- Hanya Administrator yang dapat mengubah struktur organisasi.
- Pengguna biasa hanya dapat melihat data sesuai hak akses.
- Seluruh perubahan wajib melalui Permission Check.

---

# Acceptance Criteria

Business Rules dianggap selesai apabila:

- Struktur organisasi konsisten.
- Hierarki wilayah valid.
- Jabatan mengikuti struktur organisasi.
- Hanya satu periode aktif.
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
