# 10: Ramp modul berat — sekretariat & falak

**What to build:** Rambungkan seluruh halaman HOT & biaya bermakna modul terberat ke pola tenang, per peta per-halaman (bagian 4 spec): sekretariat (26 halaman — surat-menyurat list/form/cetak, pendataan dengan stat-strip 4 + tree list-row, outgoing-mail edit dengan maks 4 group) dan falak (7 halaman — page/reports/archive/detail). Setiap halaman dipindah satu per satu ke `band`/`data-table`/`form-group` sesuai tipe di peta; tiap halaman diverifikasi terhadap daftar periksa bagian 5 spec sebelum berpindah ke halaman berikut.

**Blocked by:** 07, 08, 09

**Status:** ready-for-agent

- [ ] Seluruh halaman HOT sekretariat & falak dari peta dipindah ke pola tenang (tipe list → band + data-table; form → band + form-group; detail → band read-only).
- [ ] Tidak ada `AdminTable`, tidak ada kartu-dalam-kartu, tidak ada kartu navigasi di halaman termigrasi.
- [ ] Halaman form dengan >4 group dipecah menjadi banyak `band` sesuai alur (F2); entri berulang memakai `divider-rows` (F3).
- [ ] Printable (`cetak`) dipertahankan; tabel manual >50 baris pakai server-pagination.
- [ ] Setiap halaman melewati daftar periksa bagian 5 sebelum pindah; hasil dicatat per halaman.