# Redesign Admin: Permukaan Tenang

**Status:** Charted & spec selesai — dipromosikan `docs/07-specifications/spec-admin-permukaan-tenang.md`; revisi dokumen terkait (bagian 6) diterapkan.
**Labels:** wayfinder:map
**Created:** 2026-09-06

---

## Destination

Merombak seluruh area admin (65 halaman) menjadi alat kerja yang terasa tenang dan konsisten: kartu yang redundan dihapus, stat grid dibatasi/digabung, "daftar-dalam-kartu" pindah ke pola list divider-row (border-t/divide-y) yang sudah ada, dan kartu hanya dipertahankan di tempat yang struktural (form, tabel), semuanya dalam keluarga token yang ada (Fraunces/Inter, oklch oranye, _rounded-xl_, dark default). **Hasilnya berupa spesifikasi desain** (sistem permukaan + peta per-halaman) untuk di-handoff dan diimplementasi — bukan implementasi itu sendiri. Latar belakang motivasi: pemicu adalah kenyamanan alat kerja, bukan persoalan gaya/estetika.

## Notes

### Standing decisions (dikunci di charting)
- **Cakupan**: seluruh area admin `app/(dashboard)/admin/` (65 halaman).
- **Artifact**: spesifikasi desain (plan), bukan eksekusi kode.
- **Pemicu**: admin terasa tidak nyaman & tidak konsisten sebagai alat kerja — "terlalu banyak kartu" terkonfirmasi oleh audit (~180+ surface, ~25% stat grid, ~30% daftar-dalam-kartu).
- **Arah**: kurangi & rapikan yang ada (bukan definisikan sistem surface dari nol).
- **Identitas visual**: tetap keluarga token yang ada; hanya komposisi & permukaan yang dirombak.
- **Feedback**: belum ada akses admin nyata; penilaian prototipe oleh tim (dev/design).

### Audit fakta (baseline, dari charting)
- ~180+ permukaan kartu tersebar di ~50 halaman admin.
- Topologi: `StatCard`/stat grid (~25%), list-dalam-kartu (~30%), form group (~20%), wrapper tabel (~10%), navigasi/module cards (~15%).
- Pola "tenang" yang SUDAH ada di repo dan bisa distandarkan: list divider-row (`homepage/page.tsx:35`, `recent-activity.tsx:248`, `pendataan/page.tsx:38`), plain-box `DataTable`.
- Dua sistem tabel berbeda: `AdminTable` (legacy) dan `DataTable` (tanstack) — keputusan standarisasi ada di ticket 04.
- Top 10 hotspot: sekretariat/ (10 kartu), falak/ (7+6 nested), /admin dashboard (3+8 module), program/ (8), reports/ (7), content/ (6), falak/reports (6), twk/ (6), sekretariat/arsip (6), outgoing-mail edit (4+accordion).

### Skills
- Sesi grilling (03/04/05): panggil skill `grilling` + `domain-modeling`.
- Sesi prototype (02): panggil skill `prototype` (+ pertimbangkan `ui-ux-pro-max`).
- Sesi research (01): panggil skill `research`.

---

## Decisions so far

<!-- indeks: satu baris per ticket tertutup; detail ada di issue-nya. Diisi saat resolusi. -->

- [Inventaris aset desain yang membatasi permukaan admin](.scratch/admin-redesign/issues/01-design-assets-inventory.md): preskripsi stat/module-card di PRD admin (Completed) & `ui.md` bentrok dengan arah kurangi kartu → komposisi jadi milik spec, font lama dianggap superseded, stat boleh render sebagai divider-row. Detail: `.scratch/admin-redesign/research/01-design-assets-inventory.md`.
- [Prototipe permukaan tenang pada 3 halaman representatif](.scratch/admin-redesign/issues/02-surface-prototype-3-pages.md): varian **B Split master–detail** terpilih sebagai arah komposisi (rail teks kiri + satu band besar kanan, stat inline di header, tanpa kartu modul). Prototipe: `prototype/calm-surfaces.html`. Steal A/C belum diputuskan → ke 03/04.
- [Aturan permukaan: stat & daftar](.scratch/admin-redesign/issues/03-surface-rules-stats-lists.md): kap 4 angka stat (ke-5+ sebagai baris dalam band ringkas) tanpa kartu-dalam-kartu; aksi-lah penentu band (read-only → baris langsung); ambang tabel >10 baris; kartu navigasi/modul pindah ke rail (rail opsional ≥2 item); ritme gap-5/p-5/py-3, landing lega py-8; empty state bukan kotak kartu; mobile: rail jadi blok baris. Batas dengan ticket 04: >10 baris → tabel.
- [Aturan permukaan: form & tabel](.scratch/admin-redesign/issues/04-surface-rules-forms-tables.md): DataTable (tanstack) kanon, AdminTable di-retire (migrasi ~17 halaman), plain box token admin, header/toolbar milik band; baris border-t tanpa zebra; server-pagination >50; skeleton/DataError/DataEmpty; form satu band, grup = fieldset + border-t, maks 4 grup per band; entri berulang baris divider; hanya varian datar (elevated dihapus); hapus semua override SectionCard → standar rounded-xl p-5.
- [Struktur spec deliverable & peta per-halaman](.scratch/admin-redesign/issues/05-spec-structure-per-page-map.md): spec = draft `.scratch/admin-redesign/spec.md` → dipromosikan `docs/07-specifications/spec-admin-permukaan-tenang.md`; outline 7 bagian (prinsip · sistem permukaan · komposisi · peta 65 halaman · kriteria terukur + checklist · revisi dokumen terkait · urutan implementasi tracer-bullet); 6 label tipe fungsional; kosa kata primitif `band/rail/stat-row/list-row/data-table/form-group` (bukan CONTEXT.md).

`decisions10` semua ticket resolved (01–05) → map tuntas; spec dipromosikan ke `docs/07-specifications/spec-admin-permukaan-tenang.md` & revisi dokumen §6 diterapkan.

## Implementation tickets (06–12)

Wayfinding selesai; spec diterima. Implementasi dipecah lewat `/to-tickets` dari §7 spec:

- [06 Primitif permukaan tenang bersama](.scratch/admin-redesign/issues/06-surface-primitives.md) — blocker: (none) → **frontier sekarang**
- [07 Tracer-bullet LIST — petugas unit](.scratch/admin-redesign/issues/07-tracer-bullet-list-officers.md) — blocker: 06 → **resolved** (pola list lolos gate: band + DataTable + DataEmpty; boundary impor server-action diluruskan langsung dari file "use server")
- [08 Tracer-bullet FORM — tambah unit](.scratch/admin-redesign/issues/08-tracer-bullet-form-unit-new.md) — blocker: 06 → **resolved** (gate pola form lolos: band + FormGroup, fieldErrors per-field + aria, pending + batal)
- [09 Tracer-bullet DASHBOARD — beranda admin](.scratch/admin-redesign/issues/09-tracer-bullet-dashboard-admin.md) — blocker: 06
- [10 Ramp modul berat: sekretariat & falak](.scratch/admin-redesign/issues/10-ramp-secretariat-falak.md) — blocker: 07, 08, 09
- [11 Ramp modul lain + retire `AdminTable`](.scratch/admin-redesign/issues/11-ramp-rest-retire-admintable.md) — blocker: 07, 08, 09
- [12 Kontrak & verifikasi akhir](.scratch/admin-redesign/issues/12-contract-verification.md) — blocker: 10, 11

Status implementasi: 06 resolved (primitif + data-table admin), 07 resolved (gate pola list), 08 resolved (gate pola form) → frontier berikut 09.

## Not yet specified

<!-- fog of war: di-scope tapi belum tajam untuk di-ticket -->

- Apakah spec (destinasi) perlu memuat **urutan implementasi per modul**, atau itu ditentukan effort implementasi nanti habis map ini. (Menunggu bentuk/struktur spec — ticket 05.)
- Sejauh mana spec menetapkan **microcopy / empty-state copy** (warisan item "future" PRD admin-dashboard-refactor). Belum cukup tajam untuk di-ticket.
- Metode verifikasi **aksesibilitas (WCAG AA)** dari hasil density-reduction saat implementasi — siapa/memakai apa belum jelas.

## Out of scope

- Backend API / database / schema.
- Autentikasi / otorisasi / RBAC (roles, permissions, guard).
- Fitur atau modul baru.
- Website publik — Khusyu Minimalis (DESIGN.md) hanya dipakai sebagai referensi komposisi, bukan tujuan penyelarasan gaya.
- Domain logic admin (nomor surat, perhitungan hisab, dsb.) — hanya permukaan UI.
- Implementasi redesign itu sendiri — artifact effort ini adalah spec untuk di-handoff.