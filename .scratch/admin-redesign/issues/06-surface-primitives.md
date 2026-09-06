# 06: Primitif permukaan tenang bersama

**What to build:** Bangun primitif permukaan tenang sebagai satu-satunya sumber bagi seluruh ticket berikutnya: `band` + `BandHeader` (judul + slot aksi, `rounded-xl p-5`), `stat-strip`, `stat-row`, `list-row`, `form-group` di komponen shared admin; serta realign krom `data-table` ke token admin (BG solid `bg-admin-card-bg` + `border`, bukan token publik `bg-muted`) agar deterministik di mode terang/gelap. API `SectionCard` lama tetap stabil; varian `elevated` **belum** dihapus (dihapus di ticket kontrak 12). Ini murni pre-factor/perluasan — belum ada halaman yang dirombak di ticket ini.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [ ] Primitif `band`/`stat-strip`/`stat-row`/`list-row`/`form-group` eksis di komponen shared admin dan bisa dirender dengan token admin.
- [ ] `band` memakai satu standar `rounded-xl p-5`; heading + slot aksi; memakai `gap-5` ritme vertikal tenang.
- [ ] `data-table` memakai token admin (BG solid + border, bukan `bg-muted` publik) pada mode terang & gelap; sortir, pagination, `DataEmpty`, `DataError`, skeleton tidak regresi.
- [ ] `form-group` = `fieldset` + `border-t`, label + pesan error + pending state berfungsi.
- [ ] Varian `elevated` `SectionCard` dan `AdminTable` kategori legacy tetap bekerja (dihapus hanya di 12).
- [ ] WCAG AA: kontras teks di permukaan baru terpenuhi (terang & gelap).
## Answer

Dikerjakan. Primitif baru di `components/admin/shared/`: `band.tsx` (Band + BandHeader, `rounded-xl p-5` header+actions, header `mb-5` = ritme gap-5), `stat-primitives.tsx` (StatStrip/StatRow surface-netral, dl/dt/dd, key opsional `StatItem.key`), `list-row.tsx`, `form-group.tsx` (fieldset + `border-t` + `first:border-t-0`, desc). `data-table` di-realign ke token admin: box solid `bg-admin-card-bg` + `border-admin-border`, thead `bg-admin-border/20`, toolbar input `border-admin-input-border bg-admin-input-bg`, pagination/empty admin fg. `SectionCard` (termasuk variant elevated) & `AdminTable` tidak disentuh (kontrak = ticket 12).

Tercatat dari review: `DataError` memakai Alert destructive (bukan token teks redup) — sengaja dibiarkan; WCAG AA kontras penuh didelegasikan ke audit implementasi (ticket 12) semeja konvensi repo (fg/60, fg/50).

Validasi: typecheck & lint bersih; build sukses; 144 test lolos.
