# 03 — Aturan sistem permukaan: stat & daftar

Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

Tetapkan **himpunan aturan** sistem permukaan untuk motif statistik & daftar, bagian dari spec destinasi. **Komposisi acuan: varian B split master–detail (ticket 02)** — aturan disusun untuk bentuk rail kiri + band kanan, bukan grid kartu.

- **Stat**: berapa maks stat per halaman (/admin/falak pakai 4 StatCard; program 6; reports 7); kapan stat cukup digabung jadi satu area ringkas / MiniStat; kapan angka penuh menonjol.
- **Daftar-dalam-kartu → divider-row**: aturan keputusan kapan "list of X" boleh tetap dalam kartu vs keluar jadi daftar baris (`border-t`/`divide-y`) — berdasar jumlah item, ada/tidaknya inline action, dan apakah daftar itu inti pekerjaan halaman.
- **Kartu navigasi/modul** (dashboard module grid, falak quick-links, sekretariat mini-modules): tetap / jadi daftar / pindah ke sidebar.
- **Whitespace & densitas**: default jarak antar-area, besaran padding kohesif, kapan halaman boleh "renggang".

Resolusi: bagian "Sistem permukaan: stat & daftar" dari spec.

## Answer

Shared understanding dikonfirmasi manusia. Aturan berikut terkunci dan menjadi bagian dari spec; komposisi induk tetap B split master–detail (ticket 02).

**Statistik**
- S1. Kap 4: maksimal 4 angka stat menonjol per halaman.
- S2. Kelima+: angka berikutnya sebagai baris berlabel kecil dalam band ringkasan yang sama — tanpa kotak tambahan, tanpa halaman loncat.
- S3. Bentuk: ≤3 angka → strip tipis di atas band; 4 angka → satu band ringkasan (angka `font-heading tabular-nums`). Tidak pernah grid kartu paralel.
- S4. Dilarang kartu-dalam-kartu: primitif stat permukaan-netral; dalam band dirender sebagai baris/kolom tanpa kotak kedua.

**Daftar**
- L1. Aksi penentu: daftar dengan aksi per-baris (edit/hapus/terbitkan/status) atau konteks khusus → dalam band; daftar referensi read-only → baris langsung di halaman tanpa band.
- L2. Ambang tabel: ≤10 baris → pola baris; >10 → tabel (domain ticket 04).
- L3. Status sebagai pill kecil dalam baris.
- L4. Empty state: baris pesan dalam band bila band ada; area border putus-putus bila tanpa band; bukan kotak kartu solid.

**Navigasi**
- N1. Tanpa kartu navigasi di area kerja: module grid / quick-links / mini-modules → sidebar/rail.
- N2. Rail opsional: hanya bila ≥2 item; halaman tanpa daftar anak → satu kolom penuh.

**Ritme & responsif**
- V1. gap-5 antar band · p-5 padding band · py-3 baris · halaman landing lega (py-8) · halaman kerja rapat.
- V2. Mobile (<768px): rail jadi blok baris tautan vertikal tipis tanpa kotak di atas band.

Catatan: konflik research 01 yang dinetralkan di sini — `ui.md` ("Statistics Card" 5 total + urutan kaku) dan PRD admin (Welcome Card/Module Grid) dibatalkan oleh S1/S3; komposisi jadi kepemilikan spec.