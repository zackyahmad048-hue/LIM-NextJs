# Spec — Redesign Admin: Permukaan Tenang

**Status:** Draft (artifact wayfinder `admin-redesign`)
**Pemilik:** effort `.scratch/admin-redesign/`
**Tanggal:** 2026-09-06
**Rujukan keputusan:** `.scratch/admin-redesign/issues/01`–`05`, prototipe `prototype/calm-surfaces.html` (varian B), research `research/01-design-assets-inventory.md`
**Dokumen induk kelak:** dipromosikan ke `docs/07-specifications/spec-admin-permukaan-tenang.md`

---

## 1. Ringkasan & prinsip tenang

Area admin (65 halaman di `app/(dashboard)/admin/`) dirombak menjadi alat kerja yang tenang dan konsisten: kartu redundan dihapus, stat grid dibatasi/digabung, "daftar-dalam-kartu" menjadi daftar baris, dan kartu hanya tersisa untuk tempat struktural (form, tabel). Identitas visual **tidak** berubah: Fraunces/Inter, oranye oklch, `rounded-xl`, dark default.

Pemicu adalah kenyamanan alat kerja ("terlalu banyak kartu"), terkonfirmasi audit: ~180+ permukaan kartu di ~50 halaman (~25% stat grid, ~30% daftar-dalam-kartu, ~20% form group, ~10% wrapper tabel, ~15% navigasi/module cards).

**Prinsip:**
- Kurangi & rapikan yang ada, bukan definisikan sistem surface baru dari nol.
- Tenang = terukur (kriteria di bagian 5).
- Satu sistem untuk satu pola (khususnya satu sistem tabel).
- Kartu hanya untuk tempat struktural; navigasi milik rail/sidebar.

**Out of scope:** backend/db/schema, auth/RBAC/permission slug, fitur baru, website publik (Khusyu Minimalis hanya referensi komposisi), domain logic admin (nomor surat, hisab), implementasi itu sendiri.

---

## 2. Sistem permukaan

Kosa kata primitif (design-system, bukan glossary domain): `band`, `rail`, `stat-strip`/`stat-row`, `list-row`, `data-table`, `form-group`.

### Statistik
- **S1. Kap 4**: maksimal 4 angka stat menonjol per halaman.
- **S2. Kelima+**: angka berikutnya sebagai baris berlabel kecil dalam band ringkasan yang sama — tanpa kotak tambahan, tanpa halaman loncat.
- **S3. Bentuk**: ≤3 angka → `stat-strip` tipis di atas band; 4 angka → satu `band` ringkasan (angka `font-heading tabular-nums`). Tidak pernah grid kartu paralel.
- **S4. Tanpa kartu-dalam-kartu**: primitif stat permukaan-netral; dalam band dirender sebagai baris/kolom (`stat-row`) tanpa kotak kedua.

### Daftar
- **L1. Aksi penentu**: daftar dengan aksi per-baris (edit/hapus/terbitkan/status) atau konteks khusus → dalam `band`; daftar referensi read-only → `list-row` langsung di halaman tanpa band.
- **L2. Ambang tabel**: ≤10 baris → pola baris; >10 → `data-table`.
- **L3. Status**: sebagai pill kecil dalam baris.
- **L4. Empty state**: baris pesan dalam band bila band ada; area border putus-putus bila tanpa band. Bukan kotak kartu solid.

### Navigasi
- **N1. Tanpa kartu navigasi di area kerja**: module grid / quick-links / mini-modules → sidebar/`rail`.
- **N2. Rail opsional**: hanya bila ≥2 item; halaman tanpa daftar anak → komposisi satu kolom penuh.

### Ritme & responsif
- **V1. Whitespace**: `gap-5` antar band · `p-5` padding band · `py-3` baris · halaman landing lega (`py-8`) · halaman kerja rapat.
- **V2. Mobile (<768px)**: rail menjadi blok baris tautan vertikal tipis tanpa kotak di atas band.

### Form
- **F1. Satu band per form**: grup dipisah judul-grup + `border-t` (`form-group` = fieldset + legend); tanpa kotak per-grup.
- **F2. Kap grup**: maks 4 grup per band; >4 → pecah band per alur bermakna (mis. Data Surat · Penomoran · Lampiran), bukan per-grup mekanis.
- **F3. Entri berulang**: baris divider + tombol "tambah" di bawah (perpanjangan S4).
- **F4. Varian & shadow**: hanya varian datar; kartu `elevated`/shadow pada form & tabel dihapus; shadow tersisa hanya modal/sheet (`theme.md`).

### Tabel (`data-table`, kanonis = `DataTable` tanstack)
- **T1. Satu sistem**: `DataTable` kanon; `AdminTable` (legacy) di-retire; migrasi ~17 halaman; spec memuat kontrak server-pagination.
- **T2. Chrome**: plain box `rounded-xl border` token **admin** (bukan `bg-muted` publik). Judul, toolbar, pencarian = milik band di atas tabel. Nama aksesibel (aria-label/caption) = judul band.
- **T3. Baris**: `border-t` + hover (baris klik); tanpa zebra (selaras L1/L2).
- **T4. Pagination**: satu `DataTable` dua mode — client-side (≤50) & server-pagination (>50: `onPaginationChange`, `pageCount`, data halaman aktif); sesuai `tables.md`.
- **T5. State**: `DataEmpty` (kosong) · skeleton rows (memuat) · `DataError` (gagal).
- **T6. Kolom aksi**: paling kanan, tombol ringkas (ikon/teks kecil), tanpa group-box/dropdown-dalam-kotak.

### Bersihkan
- **X1. `SectionCard` satu sumber kebenaran**: hapus override radius/padding sebaran (`rounded-lg p-4`, `shadow-none`, `p-0`, `p-8`); standar `rounded-xl p-5`. Empty-state `p-8 text-center` → area pesan (L4).

---

## 3. Komposisi halaman

- Komposisi induk: **B split master–detail** — rail teks kiri + satu band besar kanan.
- Halaman tugas tunggal (satu tabel, satu form) → komposisi **satu kolom** (band penuh, tanpa rail) bila tak ada ≥2 item anak (N2).
- Band = unit penyelesaian: judul + toolbar (aksi halaman) + konten (daftar/stat/tabel/form).
- Melintasi 6 tipe halaman fungsional (bagian 4): dashboard / list / form / detail / print-cetak / media-arid.

---

## 4. Peta per-halaman

> 65 halaman `app/(dashboard)/admin/`. Kolom **Sesudah** menerapkan aturan §2; **Rail** = komposisi rail kiri bila modul punya ≥2 item (N2), selain itu satu kolom. **Kap** = angka stat menonjol (S1). `HOT` = hotspot audit, wajib catatan detail saat implementasi. Tabel = `data-table` (migrasi dari AdminTable sesuai T1–T6). Konvensi: band judul memegang aksi halaman (T2); group form = `form-group` fieldset+border-t (F1); header/toolbar tabel dimiliki band.

### Dasbor
| Halaman | Tipe | Rail | Sebelum → Sesudah | Kap | Catatan |
|---|---|---|---|---|---|
| `/admin` (dashboard) | dashboard | – | 3 SectionCard + module-grid + 4 MiniStat-dalam-kartu + welcome + profil → **band ringkas stat (4 besar + baris) + list-row aktivitas + module-grid → rail + welcome → headline PageHeader** | 4+1 | HOT. `DashboardClient` dirombak total; total statistik kini 5 → 4 menonjol + 1 `stat-row` (S2). Struktur & Anggota MiniStat → `stat-row` (S4) |
| `/admin/reports` | dashboard | – | 7 SectionCard (4 stat grid + breakdown + progress + sync opsional) → **band stat (4) + breakdown/progress jadi baris + band sync opsional** | 4 | HOT. Semua override `rounded-lg p-4 shadow-none` dihapus (X1); sync hanya muncul saat `reports.sync` (tetap band kondisi) |
| `/admin/content` | dashboard | rail | 6 kartu (3 angka stat + 3 nav-card) → **stat-strip (3) + nav → rail** | 3 | Angka "Halaman" hardcoded `0` — bug data (bukan UI), tandai saat implementasi |

### Content
| Halaman | Tipe | Rail | Sebelum → Sesudah | Kap | Catatan |
|---|---|---|---|---|---|
| `/admin/content/posts` | list | rail | AdminTable + search + pagination → **band + data-table** | – | Toolbar masuk band header; aksi baris kanan (T6) |
| `/admin/content/categories` | list | rail | 2 SectionCard (count-header + wrapper DataTable) → **band judul (count ringkas) + data-table plain box** | 1 | Sudah tanstack; tinggal align token admin & plain box (T2) |
| `/admin/content/pages` | list | rail | custom bordered boxes "Peta Situs" → **band daftar (baris + aksi Edit/Kelola)** | – | Hand-rolled box (`rounded-xl border … shadow-sm`) → `list-row` (L1: ada aksi) |
| `/admin/content/pages/[key]` | form | rail | PageEditor: SC teks + SC per list-field (elevated) → **1 band, form-groups (teks + tiap list-field)** | – | Buang `variant="elevated"` (F4) |
| `/admin/content/posts/new` | form | rail | PostForm 3 kartu (content + Publikasi + Aksi) → **1 band, 3 form-groups** | – | Sidebar Publikasi → group dalam band (S4) |
| `/admin/content/posts/[id]/edit` | form | rail | sama → **1 band, 3 form-groups** | – | |
| `/admin/content/media` | media-arid | rail | grid kartu item + inline empty → **grid tile (tanpa box kartu berat) + empty = area pesan (L4)** | – | Catatan: tombol Upload disabled — catatan fungsional |

### Homepage & Profil
| Halaman | Tipe | Rail | Sebelum → Sesudah | Kap | Catatan |
|---|---|---|---|---|---|
| `/admin/homepage/page` | list | rail | custom bordered box (section-status rows + info box) → **band daftar (baris status + pill) + band tipis "Cara kerja"** | – | |
| `/admin/homepage/hero` | form | rail | 3 SC (teks, CTA, 3 stat-card inputs) → **1 band, 3 form-groups** | – | Campur token admin vs `muted-foreground/border` → pindah semua ke token admin (F4/T2) |
| `/admin/homepage/about` | form | rail | stub: selalu `redirect` ke content/pages/homepage.about → **hapus stub; arahkan sidebar langsung** | – | Route mati tapi sidebar menunjuk → biasa dihapus tanpa dirombak |
| `/admin/profil/bidang` | list | rail | custom card grid (bulk statis) → **list-row langsung (read-only, L1)** | – | Konfigurasi statis; bukan tabel |
| `/admin/profil/tentang` | form | rail | PageEditor (sama dengan pages/[key]) → **1 band, form-groups** | – | |
| `/admin/profil/pengurus-pusat` | form | rail | 5 accordion SC + sidebar Ringkasan → **2 band alur (F2): "Organisasi" (org+pusat) & "Kepengurusan" (wilayah+cabang+anggota), grup fieldset; ringkasan jadi stat inline** | – | Catatan: HOT — accordion → form-group melipat opsional |

### Program
| Halaman | Tipe | Rail | Sebelum → Sesudah | Kap | Catatan |
|---|---|---|---|---|---|
| `/admin/program/page` | dashboard | rail | 6 stat SC + Program Mendatang + Akses Cepat → **band stat (4 besar + 2 stat-row) + list-row mendatang + akses cepat → rail** | 4+2 | HOT |
| `/admin/program/list` | list | rail | AdminTable (search+pagination, 7 kol) → **band + data-table (mode server bila >50)** | – | |
| `/admin/program/new` | form | rail | 2 SC group → **1 band, 2 form-groups** | – | |
| `/admin/program/[id]/edit` | form | rail | 2 SC group + tombol status + 5 sub-page link → **1 band form + sub-page link → rail + status → band header** | – | |
| `/admin/program/[id]/attendance` | list | rail | AdminTable + check-in/out dalam baris → **band + data-table; aksi baris compact (T6)** | – | `attendance as Array<any>` (baris 139) → hapus cast, perbaiki tipe (root fix) |
| `/admin/program/[id]/committees` | list | rail | plain bordered div "Tambah Panitia" + AdminTable → **form pendek → dialog/band-header + data-table** | – | 2 idiom form-kartu dalam satu modul → satu (F1) |
| `/admin/program/[id]/documentation` | list | rail | inline add-form + AdminTable → **sama** | – | mediaId diinput teks tanpa uploader — catatan fungsional |
| `/admin/program/[id]/participants` | list | rail | inline add + approve/reject + AdminTable → **sama; approver → T6** | – | |
| `/admin/program/[id]/schedules` | list | rail | inline add (max-w-lg) + AdminTable → **sama** | – | |

### Falak
| Halaman | Tipe | Rail | Sebelum → Sesudah | Kap | Catatan |
|---|---|---|---|---|---|
| `/admin/falak/page` | dashboard | rail | 4 StatCard + Menu (6 tile) + 2 list kartu → **band stat (4) + tile → rail + list-row rukyat/eclipse** | 4 | HOT |
| `/admin/falak/reports` | dashboard | rail | 4 StatCard + breakdown + history list card → **band stat (4) + breakdown baris + history list-row** | 4 | HOT |
| `/admin/falak/rukyat` | list | rail | AdminTable + toolbar + verify/confirm/archive → **band + data-table; transisi status → T6** | – | |
| `/admin/falak/hisab` | list | rail | AdminTable + search + pagination → **band + data-table** | – | |
| `/admin/falak/eclipse` | list | rail | AdminTable (tanpa toolbar) → **band + data-table** | – | |
| `/admin/falak/prayer-time` | list | rail | AdminTable 7 kol → **band + data-table** | – | Empty state ikon Clock boleh dipertahankan (T5) |
| `/admin/falak/archive` | list | rail | 2 AdminTable bertumpuk → **2 band (Arsip Rukyat / Arsip Hisab), masing-masing data-table** | – | HOT |

### Sekretariat
| Halaman | Tipe | Rail | Sebelum → Sesudah | Kap | Catatan |
|---|---|---|---|---|---|
| `/admin/secretariat` | dashboard | rail | 7 SC (queue 4 chips, 4 stat, chart, 3 recent, health, 4 modul-mini) → **band stat (4) + queue/aktivitas list-row + band chart + nav modul → rail** | 4 | HOT. 4 modul-mini (Surat Keluar/Masuk/Disposisi/Dokumen) → rail |
| `/admin/secretariat/surat-menyurat` | dashboard | – | 2 SC + 2 CTA link-card + drive bar + 2 recent panels → **band (4 angka ringkas + drive bar) + list-row recent + CTA → tombol band header** | 4 | client render PageContainer sendiri → konsistenkan (server) |
| `/admin/secretariat/arsip` | list | – | 3 stat SC + GET search + 3 AdminTable → **stat-strip (3) + 3 band data-table (server-pagination T4)** | 3 | HOT. Data-berat: mode server >50 |
| `/admin/secretariat/agenda` | list | – | AdminTable + search + pagination → **band + data-table** | – | Tombol "Agenda Baru" → band header |
| `/admin/secretariat/agenda/new` | form | – | 1 SC → **band, 1 group** | – | |
| `/admin/secretariat/agenda/[id]/edit` | form | – | 1 SC → **band, 1 group** | – | |
| `/admin/secretariat/disposition/list` | list | – | AdminTable + pagination (tanpa search) → **band + data-table (+ search global)** | – | |
| `/admin/secretariat/disposition/new` | form | – | 1 SC → **band, 1 group** | – | |
| `/admin/secretariat/disposition/[id]/edit` | form | – | status row + 1 SC → **band, status → header** | – | |
| `/admin/secretariat/document/list` | list | – | AdminTable + search + transisi status inline → **band + data-table; aksi → T6** | – | |
| `/admin/secretariat/document/new` | form | – | 2 SC → **band, 2 groups** | – | |
| `/admin/secretariat/document/[id]/edit` | form | – | status row + 2 SC → **band, 2 groups, status → header** | – | |
| `/admin/secretariat/document/[id]/cetak` | print-cetak | – | **dipertahankan** (print letter, bukan surface admin) | – | Di luar lingkup peta permukaan |
| `/admin/secretariat/incoming-mail/list` | list | – | AdminTable + search → **band + data-table** | – | |
| `/admin/secretariat/incoming-mail/new` | form | – | 2 SC → **band, 2 groups** | – | |
| `/admin/secretariat/incoming-mail/[id]/edit` | form | – | 2 SC → **band, 2 groups** | – | |
| `/admin/secretariat/outgoing-mail/list` | list | – | AdminTable + SearchForm lokal di header → **band + data-table; SearchForm → band header** | – | Konsistenkan dengan TableSearchForm→band |
| `/admin/secretariat/outgoing-mail/new` | form | – | 3 SC (Informasi + QR + Dokumen) → **band, 3 groups** | – | NumberPreview/SignerFields/SigningEditor tetap sub-komponen |
| `/admin/secretariat/outgoing-mail/[id]/edit` | form | – | 4 SC (3 + QR Verifikasi terpisah) → **band, 4 groups (maks F2)** | – | HOT (bonus 4; jangan tambah group) |
| `/admin/secretariat/outgoing-mail/[id]/cetak` | print-cetak | – | **dipertahankan** | – | |
| `/admin/secretariat/pendataan` | list | rail | 4 stat SC + Struktur tree SC + empty → **band/stat-strip (4) + band daftar tree (list-row) + "Tambah Unit" → header** | 4 | HOT |
| `/admin/secretariat/pendataan/units/new` | form | – | 1 SC → **band, 1 group** | – | |
| `/admin/secretariat/pendataan/units/[id]/edit` | form | – | 1 SC → **band, 1 group** | – | |
| `/admin/secretariat/pendataan/units/[id]/officers` | list | – | AdminTable (tanpa search) → **band + data-table** | – | |
| `/admin/secretariat/pendataan/officers/new` | form | – | 1 SC → **band, 1 group** | – | |
| `/admin/secretariat/pendataan/officers/[id]/edit` | form | – | 1 SC → **band, 1 group** | – | |

### System
| Halaman | Tipe | Rail | Sebelum → Sesudah | Kap | Catatan |
|---|---|---|---|---|---|
| `/admin/system/users` | list | rail | AdminTable (tanpa search/pagination) → **band + data-table (server-pagination T4)** | – | Users bisa >50 → mode server |
| `/admin/system/roles` | list | rail | AdminTable → **band + data-table** | – | |
| `/admin/system/penomoran` | form | rail | 5 SC (4 client + Petunjuk server di grid 2-col) → **1 band form (4 groups, F2) + band sempit "Petunjuk Format"** | – | Dynamic rows (Kode Tingkat) = F3 divider-rows; super-admin gate tetap |

### TWK
| Halaman | Tipe | Rail | Sebelum → Sesudah | Kap | Catatan |
|---|---|---|---|---|---|
| `/admin/twk` | list | rail | 4 StatCard + list-header SC + DataTable SC + dialogs → **band stat (4) + band + data-table; toolbar → band header** | 4 | Sudah tanstack → align token admin (T2); dialog tetap modal |
| `/admin/twk/[id]` | detail | rail | 4 SC (status, Data Utama, Status&Catatan, timestamps) → **1 band detail (4 form-groups read-only, F1)** | – | Edit ops → header band |
| `/admin/twk/lembaga` | list | rail | 2 SC (header + hand-rolled table) + empty → **band + data-table** | – | Tabel manual → data-table (T1); limit 50 tanpa pagination → T4 |
| `/admin/twk/lembaga/[id]` | detail | rail | 5 SC space-y-6 → **2 band alur (F2): "Identitas & Pengurus" + "Kondisi & Permohonan"; Unduh → band header** | – | HOT |

---

## 5. Kriteria "tenang" terukur + daftar periksa

Ambang numerik per halaman:
- Maks 4 angka stat menonjol (S1); angka ke-5+ sebagai `stat-row` (S2).
- 0 kartu-dalam-kartu (S4/F3).
- 0 kartu navigasi/modul di area kerja (N1).
- Maks 2 permukaan di atas fold untuk halaman tugas; 3 untuk landing (rail dihitung 1).
- 0 tabel memakai `AdminTable` (legacy) — seluruhnya `data-table` (T1).
- 0 `SectionCard` dengan override radius/padding sebaran (X1).
- Seluruh halaman lolos WCAG AA (tab order, kontras, focus).

Daftar periksa per halaman dibuat di peta (bagian 4) dan menjadi alat verifikasi saat implementasi + gate sebelum pindah modul (bagian 7).

---

## 6. Revisi dokumen terkait

Dari `research/01-design-assets-inventory.md`:

| Dokumen | Revisi |
|---|---|
| `docs/01-domains/03-dashboard/ui.md` | netralkan permukaan: "Statistics" bukan "Statistics Card"; urutan beranda = contoh, bukan mandat; hindari istilah kartu di AC |
| `docs/01-domains/03-dashboard/README.md` | netralkan penamaan: Statistics / Announcements / Welcome |
| `docs/01-domains/03-dashboard/permissions.md` | reword "kartu statistik" → "surface statistik / baris statistik"; identity permission tidak berubah |
| `docs/07-specifications/prd-admin-dashboard-refactor.md` | tandai font Bebas/Lato superseded (→ Fraunces/Inter); komposisi kartu (module grid, MiniStat, AC-06 hover-lift) superseded oleh spec ini |
| `docs/08-design-system/components.md` | §Cards: hilangkan "Statistics" dari kegunaan; StatCard/MiniStat permukaan-netral; perbaiki `SectionCard rounded-2xl` → `rounded-xl` |
| `docs/08-design-system/spacing.md` | §Card `rounded-lg` (kontradiksi theme.md v1.1) → `rounded-xl`; contoh stat-grid = bukan mandat |
| `docs/08-design-system/responsive.md` | contoh `grid-cols-4` stat = contoh, bukan mandat |
| `docs/08-design-system/layout.md` | selaraskan call-out drift `app/(dashboard)/admin/layout.tsx:58-59` (`max-w-7xl`) |

Catatan: `motion.md` §Transisi Tema (cross-fade) disupersede oleh `tema-swipe-skiper-ui` (pekerjaan dokumen terpisah, di luar spec ini).

---

## 7. Urutan implementasi (disarankan)

1. **Tracer-bullet** — 1 halaman dari tiap pola inti dulu: 1 `list` (data-table), 1 `form` (band + form-group), 1 `dashboard` (stat-band + rail). Ukur terhadap daftar periksa (bagian 5) sebagai **gate**.
2. Bila gate lolos → rampungkan **per modul**: mulai dari hotspot paling berat (sekretariat/, falak/, dashboard/) menuju halaman biasa.
3. Tiap modul rampung → validasi daftar periksa halamannya + WCAG AA, baru lanjut.
4. Promosikan spec ke `docs/07-specifications/` + lakukan revisi dokumen (bagian 6) saat implementasi tuntas.

---

*Draft kerja spec ini; versi yang dipromosikan (Status: Approved) ada di `docs/07-specifications/spec-admin-permukaan-tenang.md` (2026-09-06). Saat berubah, perbarui draft ini lalu salin ulang ke folder spec.*