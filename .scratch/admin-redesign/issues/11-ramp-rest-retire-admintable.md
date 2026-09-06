# 11: Ramp modul lain + retire `AdminTable`

**What to build:** Rambungkan sisa 30 halaman (content, homepage/profil, program, twk, system) ke pola tenang mengikuti peta per-halaman (bagian 4 spec), dan pada saat yang sama migrasikan seluruh `AdminTable` legacy (~17 halaman) ke `data-table` (T1). Boleh berjalan paralel dengan ticket 10 karena berbagi halaman yang tidak bertumpang tindih; memakai pola yang sudah terverifikasi dari gate (07/08/09).

**Blocked by:** 07, 08, 09

**Status:** ready-for-agent

- [ ] Seluruh halaman modul sisa dari peta dipindah ke pola tenang sesuai tipe (list/form/detail/dashboard).
- [ ] Tidak ada `AdminTable` tersisa di seluruh halaman; semuanya `data-table` (T1).
- [ ] Halaman detail (mis. twk `[id]`, lembaga `[id]`) memakai beberapa `band` alur (F2) atau single band read-only sesuai peta.
- [ ] Draft/call-out fungsional dari peta (mis. angka "Halaman" hardcoded 0 di content, limit 50 tanpa pagination di twk/lembaga) diputuskan/perbaiki secara minimal.
- [ ] Setiap halaman melewati daftar periksa bagian 5 sebelum pindah; hasil dicatat per halaman.