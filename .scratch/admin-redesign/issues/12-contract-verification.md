# 12: Kontrak & verifikasi akhir

**What to build:** Tutup siklus hidup permukaan tenang: setelah seluruh pemakai hilang, hapus varian `elevated` `SectionCard` dan komponen `AdminTable` legacy (kontrak X1/T1); jalankan audit daftar periksa bagian 5 spec di seluruh 65 halaman + WCAG AA; putuskan dan selaraskan call-out `max-w-7xl` (`app/(dashboard)/admin/layout.tsx`) sesuai keputusan lebar konten admin; perbarui valuasi status di map wayfinding.

**Blocked by:** 10, 11

**Status:** ready-for-agent

- [ ] Varian `elevated` `SectionCard` dihapus (shadow hanya untuk modal/sheet); seluruh call-site memakai `rounded-xl p-5`.
- [ ] Komponen `AdminTable` legacy dihapus setelah tidak ada pemakai.
- [ ] Audit 65 halaman: semua ambang §5 terpenuhi (kap stat, 0 kartu-dalam-kartu, 0 kartu navigasi, 0 `AdminTable`, 0 override `SectionCard`); WCAG AA lolos.
- [ ] Call-out `max-w-7xl` diputuskan & `layout.md` tidak lagi menyebut drift; dokumentasi peta/spec selaras dengan implementasi akhir.
- [ ] Status `spec-admin-permukaan-tenang.md` (Approved) tetap benar; semua ticket 06–12 resolved dengan `## Answer`.