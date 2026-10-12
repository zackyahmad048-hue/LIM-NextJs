# ADR-013: Ruang Lingkup Restruktur Backend Secretariat

**Project:** LIM Digital Platform

**Folder:** `05-decisions`

**Status:** Proposed

**Date:** 2026-10-12

---

# Context

`modules/secretariat` memuat enam agregat dalam satu `application/service.ts`
(586 baris) dan satu `infrastructure/repository.ts` (651 baris) dengan satu
interface repository yang mendeklarasikan sekitar 40 method.

Read-model dasbor tercampur di interface yang sama dengan operasi persistensi —
termasuk penghitungan statistik bulanan dan pemeriksaan lampiran yang hilang.

Tiga aturan dependensi dari ADR-002 dilanggar di sisi presentation:

- `admin/system/penomoran/numbering-settings-form` mengimpor tipe dari
  `infrastructure/`.
- `modules/secretariat` tidak memiliki barrel, berbeda dari `organization` dan
  `cms`, sehingga sekitar 30 titik import menembak file spesifik.
- `components/admin/shared/attachment-upload` mengikatkan modul spesifik ke
  komponen shared.

`application/service.ts` dan `infrastructure/repository.ts` tidak memiliki test
sama sekali.

---

# Decision

1. **Pecah per agregat.** Service dan repository dipecah per agregat. Interface
   repository dipecah menjadi enam interface terpisah.
2. **Read-model keluar dari repository.** Method statistik dan dasbor pindah ke
   lapisan `queries/`, sehingga repository tetap murni operasi persistensi.
3. **Karakterisasi sebelum pecahan.** Use case `service.ts` diuji lebih dulu
   sebagai pagar sebelum file digeser.
4. **Tambahkan barrel** `modules/secretariat/index.ts`, mengikuti pola
   `modules/organization/index.ts` — mengekspor domain, validations,
   presentation, dan queries saja, tidak application atau infrastructure.
5. **Satu migrasi sebagai pengecualian.** Perubahan skema dibekukan, dengan
   pengecualian satu migration untuk ADR-012.
6. **Di luar lingkup.** Pemecahan modul Letter, perpindahan halaman Pendataan,
   penghapusan `DocumentArchive`, audit log, dan perbaikan kontrak
   `attachment-upload` tidak dikerjakan sekarang; masing-masing dicatat sebagai
   tiket tersendiri.

---

# Rationale

Restruktur tanpa pagar test memindahkan sekitar 1.200 baris yang hanya bisa
diverifikasi secara visual. Karakterisasi lebih dulu membuat pemecahan dapat
dibuktikan oleh test, bukan oleh pembacaan diff.

Repository hanya perlu diuji bila ia berisi logika. Mapping Prisma yang
mechanical tidak layak diuji karena menguji mapping berarti menguji ORM.

Komponen `attachment-upload` tidak dikerjakan sekarang karena memperbaiki
kontraknya berarti menyentuh pemakaian komponen itu di seluruh halaman admin —
pekerjaan dengan risiko regresi UI sendiri, bukan bagian dari merapikan backend.

---

# Alternatives Considered

## Pecah per lapisan, bukan per agregat
Diff lebih kecil, tetapi interface repository tetap satu dan setiap pecahan
membawa sebagian read-model bersamanya.

## `repository.ts` dibiarkan utuh
Menghemat satu langkah besar, tetapi interface 269 baris dengan sekitar 40
method adalah penyebab langsung dari percabangan yang diselesaikan di sini.

## Menambahkan audit log di dalam restruktur ini
Ditolak karena audit log adalah fitur dengan bentuk sendiri, dan ADR-010 sudah
memutuskan sebagian bentuknya. Mencampurkannya membuat diff restruktur tidak
dapat direview.

---

# Consequences

- Tiga perubahan presentasi yang diabaikan dalam lingkup ini tetap tercatat
  sebagai utang: `attachment-upload`, audit log sesuai `business-rules.md`, dan
  ketidaksesuaian `permissions.md` terhadap `permission.matrix.ts`.
- Import pada 26 halaman dan 4 komponen berubah bentuk, meski isinya sama.
- Pembuangan `PROCESSED` dari enum dikerjakan di dalam restruktur ini, sebagai
  satu-satunya perubahan skema.

---

# Related Decisions

- ADR-002 Clean Architecture
- ADR-012 Siklus Surat Masuk Dua Status

---

# Acceptance Criteria

- Tidak ada file application atau infrastructure yang melebihi sekitar 250 baris.
- `domain/repository.ts` terbagi per agregat.
- Tidak ada presentation yang mengimpor dari `infrastructure`.
- Import consumer melewati barrel.
- `npm run typecheck`, `npm run lint`, dan `npm run test` lulus.

---

# Status

**Proposed**
