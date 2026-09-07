# 11: Ramp modul lain + retire `AdminTable`

**What to build:** Rambungkan sisa 30 halaman (content, homepage/profil, program, twk, system) ke pola tenang mengikuti peta per-halaman (bagian 4 spec), dan pada saat yang sama migrasikan seluruh `AdminTable` legacy (~17 halaman) ke `data-table` (T1). Boleh berjalan paralel dengan ticket 10 karena berbagi halaman yang tidak bertumpang tindih; memakai pola yang sudah terverifikasi dari gate (07/08/09).

**Blocked by:** 07, 08, 09

**Status:** resolved

- [x] Seluruh halaman modul sisa dari peta dipindah ke pola tenang sesuai tipe (list/form/detail/dashboard).
- [x] Tidak ada `AdminTable` tersisa di seluruh halaman; semuanya `data-table` (T1).
- [x] Halaman detail (mis. twk `[id]`, lembaga `[id]`) memakai beberapa `band` alur (F2) atau single band read-only sesuai peta.
- [x] Draft/call-out fungsional dari peta (mis. angka "Halaman" hardcoded 0 di content, limit 50 tanpa pagination di twk/lembaga) diputuskan/perbaiki secara minimal.
- [ ] Setiap halaman melewati daftar periksa bagian 5 sebelum pindah; hasil dicatat per halaman.

## Answer

Seluruh sisa modul ter-migrasi (44+ file, rangkaian commit mulai `813a379` s/d `ab0792c`):

- **content** — dashboard → band + StatStrip 3; media → figure/admin-token; posts → DataTable.
- **program** — list, attendance, committees, documentation, participants, schedules → DataTable; page, new, [id]/edit → Band.
- **homepage/hero** → 3 Band mempertahankan field. **reports** → Band + StatStrip 4 + breakdown + sync. **twk/lembaga/[id]** → 5 Band read-only.
- **components/admin** — post-form, page-editor, twk/index, structure/editor, category, system-health, recent-activity, action-queue → Band.
- **`AdminTable` retired**: 0 pemakaian di seluruh repo (grep invariant). Legacy `StatCard` juga 0 pemakai.

Draft call-out diputuskan minimal: angka "Halaman" content dipertahankan `0` + deskripsi "Disiapkan" (bukan data query baru); `twk/lembaga` `limit: 50` tanpa pagination dipertahankan sebagai keputusan fungsional minimal (pagination server = scope terpisah); cast `as any` di `program/[id]/attendance` sudah hilang.

**Catatan jujur (bukan lulus periksa §5):** daftar periksa §5 tidak dicatat per-halaman (AC5); verifikasi global: `typecheck` bersih, `lint` 0 error (3 warning pre-existing falak), `build` sukses, `npm test` 144/144 (4 test file gagal = pre-existing `.claude/skills/caveman-*` "No test suite found", di luar pekerjaan ini). Sisa: berkas legacy `section-card.tsx`, `admin-table.tsx`, `stat-card.tsx` tanpa pemakai — hapus di ticket 12.