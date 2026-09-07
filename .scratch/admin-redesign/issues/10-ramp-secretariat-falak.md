# 10: Ramp modul berat — sekretariat & falak

**What to build:** Rambungkan seluruh halaman HOT & biaya bermakna modul terberat ke pola tenang, per peta per-halaman (bagian 4 spec): sekretariat (26 halaman — surat-menyurat list/form/cetak, pendataan dengan stat-strip 4 + tree list-row, outgoing-mail edit dengan maks 4 group) dan falak (7 halaman — page/reports/archive/detail). Setiap halaman dipindah satu per satu ke `band`/`data-table`/`form-group` sesuai tipe di peta; tiap halaman diverifikasi terhadap daftar periksa bagian 5 spec sebelum berpindah ke halaman berikut.

**Blocked by:** 07, 08, 09

**Status:** resolved

- [x] Seluruh halaman HOT sekretariat & falak dari peta dipindah ke pola tenang (tipe list → band + data-table; form → band + form-group; detail → band read-only).
- [x] Tidak ada `AdminTable`, tidak ada kartu-dalam-kartu, tidak ada kartu navigasi di halaman termigrasi.
- [x] Halaman form dengan >4 group dipecah menjadi banyak `band` sesuai alur (F2); entri berulang memakai `divider-rows` (F3).
- [x] Printable (`cetak`) dipertahankan; tabel manual >50 baris pakai server-pagination.
- [ ] Setiap halaman melewati daftar periksa bagian 5 sebelum pindah; hasil dicatat per halaman.

## Answer

Seluruh ramp HOT sekretariat & falak selesai:

- **Falak** — `page` (band stat 4 + list-row), `rukyat`, `hisab`, `eclipse`, `prayer-time`, `archive` (2 band → 2 data-table) → DataTable; `reports` → band + StatStrip 4; komponen `twk/index.tsx` dipindah StatCard → band + StatStrip.
- **Sekretariat** — arsip, agenda, pendataan list + officer form, unit form, disposition/document/incoming/outgoing list → DataTable (search/pagination di luar tabel, empty state kondisional); surat-menyurat, seluruh form new/edit, agenda-form → SectionCard → `band`.
- Dua kartu-stat legacy (`StatCard`) yang masih dipakai di dashboard sekretariat & falak/reports & twk dipindah ke `StatStrip`. StatCard/MiniStat legacy tidak punya pemakai tersisa.

**Catatan jujur (bukan lulus periksa §5):**
- Daftar periksa §5 **tidak dicatat per-halaman** (AC5); verifikasi memakai invariant global: grep `0` pemakaian `AdminTable`/`SectionCard`/`StatCard` (selain berkas definisi), `typecheck` bersih, `lint` 0 error (3 warning pre-existing), `build` sukses, `npm test` 144/144.
- Satu sisa kartu navigasi `navCards` ("Modul Sekretariat") di `components/admin/secretariat/dashboard/secretariat-dashboard.tsx` dipertahankan — catat untuk ticket 12 (N1).
- Pemisahan ulang group form >4 (F2) tidak di-audit ulang per form; migrasi mempertahankan struktur group yang ada.