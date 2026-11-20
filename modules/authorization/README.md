# Authorization Module

Sumber kebenaran otorisasi API dan UI untuk peran (15 role), cakupan data, dan permission API key.

## Isi

- `domain/permissions.ts` — tipe subjek, scope, aksi, resource, keputusan.
- `domain/matrix.ts` — matriks per modul/resource, helper `x-lim-auth` untuk OpenAPI.
- `application/guard.ts` — pengecekan izin runtime (role + scope organisasi/resource).

## Prinsip

- Izin efektif = `role` + cakupan organisasi/resource (+ penugasan/periode aktif bila relevan).
- Akun `ORGANIZATIONAL`: identitas pengisi diturunkan server, bukan dari client.
- Guard dipakai baik oleh Server Action maupun Route Handler `/api/v1`.

## Pengembangan

Batch 0 mencakup matriks dan guard untuk modul `letter` (pilot). Modul lain ditambahkan per batch berikutnya dengan pola yang sama dan satu matriks bersama.
