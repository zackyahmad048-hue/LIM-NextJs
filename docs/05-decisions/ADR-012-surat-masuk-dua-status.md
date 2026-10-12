# ADR-012: Siklus Surat Masuk Dua Status

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Proposed

**Date:** 2026-10-12

---

# Context

`IncomingMail` memiliki tiga nilai status: `RECEIVED`, `PROCESSED`, dan
`ARCHIVED`. Tidak satu pun kode pernah menulis nilai `PROCESSED`.

Satu-satunya produser status Surat Masuk adalah pembuatan surat baru, yang
memaksa status `ARCHIVED`. Akibatnya setiap surat masuk lahir dalam keadaan
sudah diarsipkan, sehingga:

- Halaman `/admin/secretariat/incoming-mail/list?status=RECEIVED`, yang
  ditautkan dari dasbor, secara struktural tidak pernah menampilkan hasil.
- Label "Diproses" pada dasbor menampilkan status yang mustahil terjadi.
- `docs/01-domains/07-secretariat/business-rules.md` menyebut tahap "selesai
  diproses" sebelum diarsipkan — ada langkah domain yang tidak pernah dapat
  dicapai.

---

# Decision

Siklus hidup Surat Masuk disederhanakan menjadi dua status:

```text
RECEIVED → ARCHIVED
```

Surat masuk baru dicatat berstatus `RECEIVED`. Perubahan ke `ARCHIVED`
dilakukan lewat aksi eksplisit operator. Nilai `PROCESSED` tidak lagi
dihasilkan kode mana pun.

Nilai `PROCESSED` dibuang dari enum `IncomingMailStatus` lewat satu migration,
setelah tidak ada lagi kode yang merujuknya. Migration ini juga mengubah baris
yang masih memakai nilai tersebut menjadi `ARCHIVED`.

---

# Rationale

Status `PROCESSED` sebagai langkah manual hanya menduplikasi informasi yang
sudah tercatat: keberadaan Disposisi atas sebuah Surat Masuk sudah menyatakan
bahwa surat itu ditangani oleh siapa dan sampai kapan.

Kebalikannya juga tidak cukup. Mengganti pengarsipan otomatis dengan pencatatan
`RECEIVED` tanpa menambahkan cara memindahkan status hanya memindahkan masalah:
setiap surat baru akan menggantung di `RECEIVED` selamanya, dan halaman Arsip
yang ada di sidebar akan kosong.

---

# Alternatives Considered

## Tiga status, `PROCESSED` dipicu pembuatan Disposisi
Lebih dekat ke `business-rules.md`, tetapi menambah status turunan yang tidak
pernah dibaca operator secara langsung.

## Dua status, tanpa UI pengarsipan
Surat masuk menggantung di `RECEIVED` selamanya. Ditolak karena
`/admin/secretariat/arsip` menjadi halaman kosong yang terlihat oleh pengguna.

## Biarkan status tidak berubah
Tidak memperbaiki apa pun; operator tetap tidak dapat memindahkan surat.

---

# Consequences

- Migration menghapus `PROCESSED` dari enum dan mengubah baris yang masih
  memakainya menjadi `ARCHIVED`. Ini satu-satunya perubahan skema di dalam
  restruktur backend secretariat, dan menjadi pengecualian terhadap ADR-013.
- Halaman edit Surat Masuk kehilangan keterangan "Surat masuk otomatis
  diarsipkan saat disimpan" dan mendapat kendali pengarsipan.
- Label "Diproses" pada dasbor dihapus.
- `docs/01-domains/07-secretariat/business-rules.md` perlu diselaraskan.

---

# Related Decisions

- ADR-002 Clean Architecture
- ADR-013 Ruang Lingkup Restruktur Backend Secretariat

---

# Acceptance Criteria

- Surat masuk baru berstatus `RECEIVED`.
- Aksi pengarsipan tersedia dan transisi ke `ARCHIVED` berhasil.
- Tidak ada kode yang menghasilkan atau membaca `PROCESSED`.
- Halaman Arsip menampilkan surat masuk yang diarsipkan.

---

# Status

**Proposed**
