# 09: Tracer-bullet DASHBOARD — beranda admin

**What to build:** Rombak beranda admin (halaman HOT, landing pola dashboard) ke tata letak tenang: `rail` navigasi ringkas di kiri + satu `band` statistik besar (maks 4 angka menonjol → stat-strip/band ringkas; angka lebih → `stat-row`), daftar aktivitas terbaru sebagai `list-row`, tanpa kartu navigasi/modul, tanpa kartu-dalam-kartu, sapaan dipindah ke headline. Berfungsi sebagai **gate pola dashboard** (daftar periksa bagian 5 spec).

**Blocked by:** 06

**Status:** ready-for-agent

- [ ] Layout: `rail` di kiri (bila ≥2 item) + band statistik; maks 2 permukaan di atas fold.
- [ ] Maks 4 angka menonjol; angka ke-5+ sebagai `stat-row`; tanpa grid kartu statistik paralel.
- [ ] 0 kartu-dalam-kartu; 0 kartu navigasi di area kerja (navigasi pindah ke rail/sidebar).
- [ ] Aktivitas terbaru & pengumuman dirender sebagai baris (`list-row`), bukan daftar-dalam-kartu.
- [ ] WCAG AA dan hasilnya tercatat sebagai gate pola dashboard yang lolos.