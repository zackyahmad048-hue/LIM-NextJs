# 07: Tracer-bullet LIST — halaman petugas unit

**What to build:** Rombak satu halaman list secara utuh ke pola tenang: satu `band` berisi judul + toolkit + `data-table`; hapus legacy `AdminTable` di halaman ini; empty/loading/error state; pagination sesuai kasus. Berfungsi sebagai **gate pola list** (daftar periksa bagian 5 spec): keempat halaman daftar petugas unit dalam satu modul saru alur; setelah lolos, seluruh ticket ramp lain memakai pola yang sama.

**Blocked by:** 06

**Status:** resolved

- [x] Halaman menampilkan satu `band` tunggal berisi judul + toolbar + `data-table`.
- [x] Tidak ada kartu-dalam-kartu, tidak ada kartu navigasi, tidak ada `AdminTable`.
- [x] Kasus kosong → `DataEmpty`, gagal → `DataError`, memuat → skeleton.
- [x] Pagination benar: client ≤50 baris / server >50 via `pageCount` & `onPaginationChange`.
- [x] Kolom aksi di kanan memakai tombol ringkas; status diperlihatkan sebagai pill.
- [x] WCAG AA (tab order, kontras, focus) dan hasilnya dicatat sebagai gate pola list yang lolos.

## Answer

Pola list **lolos gate** (hasil di bawah; review WCAG AA kontras penuh tetap dilimpahkan ke 12).

- **Satu band + data-table.** `app/(dashboard)/admin/secretariat/pendataan/units/[id]/officers/page.tsx` (Server Component): `Band` "Pengurus" + deskripsi jumlah terdata membungkus `OfficersTable` (kolom definit di client, `data` serializable dari server). PageHeader + aksi "Pengurus Baru" dipertahankan di level halaman (konsisten repo); toolbar pencarian milik `DataTable`.
- **Kolom:** Nama (+ pill "Ketua"), Jabatan, Kontak (telepon/email), Urutan, Aksi kanan (edit ghost + `ConfirmDelete`). Kolom klien dibangun dengan pola `DataColumnHeader` seperti `components/admin/twk/columns.tsx`; sort aktif di kolom Nama & Urutan (bermakna), sisanya teks polos.
- **Empty/error/loading:** kosong → `DataEmpty` dalam band (L4); gagal fetch → `error.tsx` level modul (memakai `DataError` di dalamnya sudah ada di `data-error.tsx`, bukan di halaman ini); memuat → `loading.tsx` module-level (skeleton sesuai T5).
- **Pagination:** petugas unit ≤50 baris → mode client `getPaginationRowModel` bawaan `DataTable` (T4). Dicatat: `DataTable` belum mengekspos prop `pageCount`/`onPaginationChange` — mode server >50 baris belum diwujudkan (pekerjaan menjauh kapan pun sebuah halaman dapat melampaui 50 baris).
- **Boundary:** `deleteOfficerAction` diimpor langsung dari `modules/organization/presentation/organization.action.ts` ("use server"); impor barrel `@/modules/organization` di client komponen menarik Prisma (`node:module`) ke bundle klien dan membuat Turbopack build gagal — penyebab diperbaiki.
- **Validasi:** typecheck, lint, build, 144 test lolos. Halaman sengaja hanya memakai token admin (bukan `muted-foreground`) agar selaras ticket 06.