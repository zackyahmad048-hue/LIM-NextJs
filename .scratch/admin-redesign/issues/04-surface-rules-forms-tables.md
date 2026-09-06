# 04 — Aturan sistem permukaan: form & tabel

Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

Tetapkan aturan untuk dua permukaan kerja yang tersisa, bagian dari spec destinasi. **Komposisi acuan: varian B split master–detail (ticket 02)** — form cenderung satu band (grup sebagai pembatas/fieldset), tabel cenderung plain box, bukan tumpukan kartu.

- **Form grouping**: `SectionCard` sebagai pengelompok field — kapan boleh dipakai, berapa maks per form, apakah perlu sub-hirarki (fieldset vs card) untuk form panjang (outgoing-mail/new 3 card, penomoran 4).
- **Tabel**: admin punya DUA sistem — `AdminTable` (legacy generik, `components/admin/shared/admin-table.tsx`) dan `DataTable` (tanstack, `data-table/`). Standarisasi ke mana; kanonis wrapper tabel (card chrome vs plain box); header/search/pagination; dan kebijakan tabel padat untuk area data-heavy (Sekretariat arsip 3 tabel, Falak, TWK).

Resolusi: bagian "Sistem permukaan: form & tabel" dari spec. Konfirmasi manusia diterima.

## Answer

**Tabel** (sistem kanon = DataTable tanstack)
- T1. Satu sistem: DataTable kanon; AdminTable legacy di-retire; spec memuat migrasi ~17 halaman + kontrak server-pagination.
- T2. Chrome: plain box `rounded-xl border` token admin (bukan `bg-muted` publik); judul + toolbar + pencarian = milik band; nama aksesibel tabel (aria-label/caption) = judul band.
- T3. Baris: `border-t` + hover (baris klik); tanpa zebra (selaras L1/L2).
- T4. Pagination: satu DataTable dua mode — client-side (≤50) & server-pagination (>50: `onPaginationChange`, `pageCount`, data halaman aktif); sesuai tables.md.
- T5. State: DataEmpty (kosong, reuse) · skeleton rows (memuat) · DataError (gagal, reuse).
- T6. Kolom aksi: paling kanan, tombol ringkas (ikon/teks kecil), tanpa group-box/dropdown-dalam-kotak.

**Form**
- F1. Satu band per form; grup dipisah judul-grup + `border-t` (fieldset + legend); tanpa kotak per-grup.
- F2. Kap grup: maks 4 grup per band; >4 → pecah band per alur bermakna (mis. Data Surat · Penomoran · Lampiran), bukan per-grup mekanis.
- F3. Entri berulang = baris divider + tombol "tambah" di bawah (perpanjangan S4).
- F4. Varian & shadow: hanya varian datar; `elevated` dihapus; shadow tersisa hanya modal/sheet (theme.md).

**Bersihkan**
- X1. SectionCard satu sumber kebenaran: hapus override radius/padding sebaran (`rounded-lg p-4`, `shadow-none`, `p-0`, `p-8`); standar `rounded-xl p-5` (V1). Empty-state `p-8 text-center` → area pesan (L4).

Catatan: konflik research dinetralkan — `spacing.md` §Card `rounded-lg` (stale) tuntas lewat X1; StatCard/MiniStat & contoh grid stat → tiket 03. Drift `layout.tsx` `max-w-7xl` tetap call-out untuk tiket 05.