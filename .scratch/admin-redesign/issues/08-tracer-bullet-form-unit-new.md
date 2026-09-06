# 08: Tracer-bullet FORM — halaman tambah unit

**What to build:** Rombak satu halaman form secara utuh ke pola tenang: satu `band` form dengan `form-group` (`fieldset` + `border-t`), validasi + pesan error berguna, pending state, tombol simpan/batal benar. Berfungsi sebagai **gate pola form** (daftar periksa bagian 5 spec): alur tambah satu unit baru dari awal hingga tersimpan.

**Blocked by:** 06

**Status:** resolved

- [x] Halaman menampilkan satu `band` form; `form-group` = `fieldset` + `border-t`; maks 4 grup.
- [x] Tiap kontrol punya label yang terhubung; validasi pada server dan pesan error di samping field (bukan hanya alert).
- [x] Tombol simpan punya pending state; tombol batal mengarahkan kembali tanpa menyimpan.
- [x] Tidak ada kartu-dalam-kartu; bankg form memakai `rounded-xl p-5`.
- [x] WCAG AA (label, fokus, pesan error via aria) dan hasilnya tercatat sebagai gate pola form yang lolos.

## Answer

Pola form **lolos gate** (hasil di bawah; review WCAG AA kontras penuh tetap dilimpahkan ke 12).

- **Satu band + form-group.** `UnitForm` (dipakai `units/new` dan `units/[id]/edit`) kini `Band` (rounded-xl p-5, header opsional) → `FormGroup` `fieldset` legend "Informasi Unit" + deskripsi kode unit; 1 grup (≤4). `SectionCard` tidak dipakai lagi di form ini.
- **Error per field.** `ActionResult` diperluas additif dengan `fieldErrors?: Record<string,string>`; `createUnitAction`/`updateUnitAction` mengembalikan `fieldErrors` dari `parsed.error.flatten().fieldErrors` (pesan pertama per field) lewat helper `fieldErrorMap`. Form merender pesan error di samping tiap field dengan `id` unik + `aria-invalid` + `aria-describedby` + `role="alert"`; `parentId` menukar `aria-describedby` antara helper dan error, keduanya tidak pernah render bersamaan.
- **Pending + batal.** Tombol simpan `disabled={pending}` ("Menyimpan..."); tombol "Batal" = `Link` ke `/admin/secretariat/pendataan` (tanpa submit).
- **Edit mode tidak regresi:** `initial.level/parentId` tetap mengisi state, `defaultValue` prefill code/name/sortOrder, jalur `updateUnitAction.bind(null, id)` tidak berubah.
- **Boundary:** aksi diimpor langsung dari file "use server" (pola ticket 07).
- **Validasi:** typecheck (heap flag), lint, build, 144 test lolos. Catatan: pesan sukses (`ok:true`) sebenarnya belum terlihat oleh `action-result-message` (kondisi-preexisting, di luar ticket).