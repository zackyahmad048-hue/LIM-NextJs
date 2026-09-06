# 08: Tracer-bullet FORM — halaman tambah unit

**What to build:** Rombak satu halaman form secara utuh ke pola tenang: satu `band` form dengan `form-group` (`fieldset` + `border-t`), validasi + pesan error berguna, pending state, tombol simpan/batal benar. Berfungsi sebagai **gate pola form** (daftar periksa bagian 5 spec): alur tambah satu unit baru dari awal hingga tersimpan.

**Blocked by:** 06

**Status:** ready-for-agent

- [ ] Halaman menampilkan satu `band` form; `form-group` = `fieldset` + `border-t`; maks 4 grup.
- [ ] Tiap kontrol punya label yang terhubung; validasi pada server dan pesan error di samping field (bukan hanya alert).
- [ ] Tombol simpan punya pending state; tombol batal mengarahkan kembali tanpa menyimpan.
- [ ] Tidak ada kartu-dalam-kartu; bankg form memakai `rounded-xl p-5`.
- [ ] WCAG AA (label, fokus, pesan error via aria) dan hasilnya tercatat sebagai gate pola form yang lolos.