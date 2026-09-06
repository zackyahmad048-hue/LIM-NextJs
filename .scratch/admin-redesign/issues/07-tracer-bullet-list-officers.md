# 07: Tracer-bullet LIST — halaman petugas unit

**What to build:** Rombak satu halaman list secara utuh ke pola tenang: satu `band` berisi judul + toolkit + `data-table`; hapus legacy `AdminTable` di halaman ini; empty/loading/error state; pagination sesuai kasus. Berfungsi sebagai **gate pola list** (daftar periksa bagian 5 spec): keempat halaman daftar petugas unit dalam satu modul saru alur; setelah lolos, seluruh ticket ramp lain memakai pola yang sama.

**Blocked by:** 06

**Status:** ready-for-agent

- [ ] Halaman menampilkan satu `band` tunggal berisi judul + toolbar + `data-table`.
- [ ] Tidak ada kartu-dalam-kartu, tidak ada kartu navigasi, tidak ada `AdminTable`.
- [ ] Kasus kosong → `DataEmpty`, gagal → `DataError`, memuat → skeleton.
- [ ] Pagination benar: client ≤50 baris / server >50 via `pageCount` & `onPaginationChange`.
- [ ] Kolom aksi di kanan memakai tombol ringkas; status diperlihatkan sebagai pill.
- [ ] WCAG AA (tab order, kontras, focus) dan hasilnya dicatat sebagai gate pola list yang lolos.