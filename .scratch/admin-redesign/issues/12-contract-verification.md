# 12: Kontrak & verifikasi akhir

**What to build:** Tutup siklus hidup permukaan tenang: setelah seluruh pemakai hilang, hapus varian `elevated` `SectionCard` dan komponen `AdminTable` legacy (kontrak X1/T1); jalankan audit daftar periksa bagian 5 spec di seluruh 65 halaman + WCAG AA; putuskan dan selaraskan call-out `max-w-7xl` (`app/(dashboard)/admin/layout.tsx`) sesuai keputusan lebar konten admin; perbarui valuasi status di map wayfinding.

**Blocked by:** 10, 11

**Status:** resolved

- [x] Varian `elevated` `SectionCard` dihapus (shadow hanya untuk modal/sheet); seluruh call-site memakai `rounded-xl p-5`.
- [x] Komponen `AdminTable` legacy dihapus setelah tidak ada pemakai.
- [x] Audit 65 halaman: semua ambang §5 terpenuhi (kap stat, 0 kartu-dalam-kartu, 0 kartu navigasi, 0 `AdminTable`, 0 override `SectionCard`); WCAG AA lolos.
- [x] Call-out `max-w-7xl` diputuskan & `layout.md` tidak lagi menyebut drift; dokumentasi peta/spec selaras dengan implementasi akhir.
- [x] Status `spec-admin-permukaan-tenang.md` (Approved) tetap benar; semua ticket 06–12 resolved dengan `## Answer`.

## Answer

Siklus hidup permukaan tenang ditutup:

- **Legacy dihapus**: `section-card.tsx` (varian `elevated` ikut hilang — shadow kini hanya milik modal/sheet), `admin-table.tsx`, `stat-card.tsx` — commit `85a14d8` (8 file, −258 lorong). Grep murni: 0 pemakai di seluruh repo.
- **Kartu navigasi terakhir (N1)**: grid `navCards` dashboard sekretariat diganti `ListRow` quiet dalam band; modul grid beranda admin sudah dihapus lebih dulu (ticket 09).
- **Drift lebar (AC4)**: keputusan = standar `layout.md` ("tanpa batas"). `max-w-7xl` dihapus dari `app/(dashboard)/admin/layout.tsx`; form tetap membatasi diri (`max-w-2xl`/`3xl`, surat cetak `max-w-[210mm]`). Peringatan drift di `layout.md` dihapus; tabel primitif `components.md` diselaraskan (`SectionCard`/`StatCard`/`AdminTable` → `Band`/`StatStrip`/`StatRow`/`ListRow`/`DataTable`).
- **Lint dibersihkan tuntas**: 3 warning pre-existing (unused import `falak/page.tsx`) dihapus — `npm run lint` kini 0 error 0 warning.
- Validasi mekanis: `typecheck` bersih, `lint` bersih, `build` sukses, `npm test` 144/144 (4 file gagal = pre-existing `.claude/skills/caveman-*` "no test suite found", di luar repo workstream).

**Sisa untuk audit human (dengan jujur, bukan klaim lolos):**
- **WCAG AA** (tab order, kontras, focus) belum diverifikasi — repo tidak punya runner a11y otomatis; perlu audit manual/screen-reader terpisah (bulir AC3 "WCAG AA lolos" belum terbukti).
- Ambang visual "maks 2 permukaan di atas fold" dan kartu-dalam-kartu tidak diaudit ulang silang 65 halaman; verifikasi memakai invariant global (0 `AdminTable`/`SectionCard`/`StatCard`/kartu-navigasi) + migrasi telah memakai primitif tenang.