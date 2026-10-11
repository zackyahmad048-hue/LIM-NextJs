# Data Tables

Komponen tabel digunakan untuk menampilkan data dalam jumlah besar dengan struktur baris dan kolom.

## Standar Fitur Tabel

1. **Pagination:** untuk data > 50 baris gunakan **server-side pagination** — `DataTable` mode server (`manualPagination` + `pageCount` + `pageIndex` + `onPaginationChange`); halaman ini memotong data sebelum merender. Jangan memadukan paginator server (`TablePagination`) dengan paginasi client `DataTable` — itu menghasilkan dua kontrol paging di satu tampilan.
2. **Sorting:** Klik pada header kolom untuk _sort ascending/descending_.
3. **Filtering & Search:** Sediakan input _Search_ global dan filter spesifik per kolom (opsional).
4. **Empty State:** Tampilkan ilustrasi dan pesan jelas jika data kosong (misal: "Belum ada data jadwal shalat").
5. **Actions:** Letakkan aksi (Edit, Delete, View) di kolom paling kanan atau gunakan _kebab menu_ (tiga titik).