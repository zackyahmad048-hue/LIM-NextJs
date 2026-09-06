# 09: Tracer-bullet DASHBOARD — beranda admin

**What to build:** Rombak beranda admin (halaman HOT, landing pola dashboard) ke tata letak tenang: `rail` navigasi ringkas di kiri + satu `band` statistik besar (maks 4 angka menonjol → stat-strip/band ringkas; angka lebih → `stat-row`), daftar aktivitas terbaru sebagai `list-row`, tanpa kartu navigasi/modul, tanpa kartu-dalam-kartu, sapaan dipindah ke headline. Berfungsi sebagai **gate pola dashboard** (daftar periksa bagian 5 spec).

**Blocked by:** 06

**Status:** resolved

- [x] Layout: `rail` di kiri (bila ≥2 item) + band statistik; maks 2 permukaan di atas fold.
- [x] Maks 4 angka menonjol; angka ke-5+ sebagai `stat-row`; tanpa grid kartu statistik paralel.
- [x] 0 kartu-dalam-kartu; 0 kartu navigasi di area kerja (navigasi pindah ke rail/sidebar).
- [x] Aktivitas terbaru & pengumuman dirender sebagai baris (`list-row`), bukan daftar-dalam-kartu.
- [x] WCAG AA dan hasilnya tercatat sebagai gate pola dashboard yang lolos.

## Answer

Pola dashboard **lolos gate** (hasil di bawah; kontras WCAG AA penuh tetap dilimpahkan ke 12).

- **Komposisi `/admin` sesuai peta spec (§4):** rail "–" (satu kolom — navigasi modul sudah penuh di sidebar `config/navigation.ts`), welcome → headline `PageHeader` (+ badge peran), module-grid dihapus (N1).
- **Statistik 4+1 (S1/S2/S3/S4):** satu `band` ringkasan "Struktur & Anggota" memuat 4 angka menonjol (`StatStrip`, font-heading tabular-nums) + baris google-sheet (border-t). Angka ke-5 (`profil.misi.length`) sebagai `stat-row` berlabel kecil di bagian Profil; bukan grid kartu paralel, tidak ada kartu-dalam-kartu. `StructStrip` docstring diselaraskan S1 (kap 4; ≤3 strip tipis).
- **Profil (L1):** visi/misi read-only → `list-row` langsung di halaman tanpa band; "+N poin misi lainnya" sebagai `<li>` teks redup (bukan judul h3). StatRow misi memakai `max-w-2xl` sejajar baris.
- **Lainnya dipertahankan:** role badge, `PreviewDialog` + google-sheet row, aksi "Kelola" (struktur & profil) di header band/seksi. Catatan: empty-state "Belum ada modul" lama dihapus bersama grid (karena navigasi kini sidebar; pengguna tanpa hak tetap melihat ringkasan organisasi).
- **Boundary:** `DashboardClient` (kini **Server Component** `AdminDashboard`) — tanpa hook/state; hanya menerima data serializable + satu client child (`PreviewDialog`).
- **Validasi:** typecheck (heap flag), lint, build, 144 test lolos.