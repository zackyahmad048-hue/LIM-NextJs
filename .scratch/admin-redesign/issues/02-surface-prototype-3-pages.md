# 02 — Prototipe permukaan tenang pada 3 halaman representatif

Type: prototype
Status: resolved
Blocked by: -

## Question

Seperti apa "permukaan tenang" yang diinginkan jika langsung diterapkan ke **3 halaman representatif** mewakili motif kard di 65 halaman?

## Asset

- Prototipe: `prototype/calm-surfaces.html` — satu halaman HTML throwaway, token admin asli, 3 scene (Falak / Beranda / Surat keluar), 4 varian (`?variant=current|A|B|C`, panah ‹ › / keyboard). Jalankan: buka file di browser.

<!-- body asli di bawah -->

Pilih satu per motif:

1. **Stat+modul heavy** (dashboard /admin — 3 SectionCard + 8 module cards; atau /admin/falak — 7 + 6 nested).
2. **Daftar-dalam-kartu** di mana pola tenangnya SUDAH ada sebagai referensi (/admin/homepage, /admin/secretariat recent-activity + action-queue).
3. **Form group** (/admin/secretariat/outgoing-mail/new — 3 SectionCard, atau /admin/homepage/hero).

Buat prototipe kasar (outline/stub/render web boleh) versi "tenang" dari ketiga halaman untuk **direaksikan**: kartu mana dihapus, mana bergeser ke divider-row list, bagaimana stat grid dibatasi dan whitespace dikelola. Tangent: jangan over-design; cukup omong "this looks like" / "this behaves like".

Link prototipe sebagai aset dari issue ini. Resolusi mencatat reaksi manusia + arah mana yang dipilih.

## Answer

**Verdict (manusia):** varian **B — Split master–detail** paling nyaman sebagai alat kerja → B terpilih sebagai arah komposisi.

Apa yang dikunci oleh keputusan ini:
- Komposisi **dua kolom**: rail teks tipis di kiri (daftar bagian/menu/grup form), **satu band besar** di kanan berisi fokus aktif.
- Statistik **inline di header band**, bukan grid kartu stat yang saling berdampingan.
- **Tidak ada kartu modul** di motif ini; navigasi melalui sidebar/rail.

Yang tetap terbuka (bukan diputuskan di sini, alat untuk ticket 03/04):
- Steal potensial dari A (stat strip / divider-rows untuk daftar) dan C (satu-fokus-per-waktu untuk form panjang) — dievaluasi saat aturan permukaan disusun.
- Keputusan detail per motif (stat, daftar, form) milik ticket 03 dan 04.

Catatan:
- Prototipe tersimpan sebagai aset tracker (primary source) dan ter-link dari issue ini. Belum di-fold ke kode — folding adalah pekerjaan implementasi real, di luar scope map (artifact = spec). Belum di-commit ke branch throwaway meski aset tersimpan permanen di `.scratch/`.