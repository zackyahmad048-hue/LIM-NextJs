# API Contract — Modul Safari Ramadan

**Status:** Batch 2  
**Base path:** `/api/v1`  
**Tag:** `Safari`  
**Spec:** `openapi/safari.yaml`, gabungan `openapi/v1.json`

## Endpoint

| Method | Path | Deskripsi | Idempotensi | Auth |
|---|---|---|---|---|
| GET | `/safari/titik` | Daftar titik safari | - | wajib |
| POST | `/safari/titik` | Buat titik safari | `Idempotency-Key` | wajib |
| GET | `/safari/titik/{id}` | Detail titik | - | wajib |
| PATCH | `/safari/titik/{id}` | Ubah titik | - | wajib |
| GET | `/safari/delegasi` | Daftar delegasi | - | wajib |
| POST | `/safari/delegasi` | Buat delegasi | `Idempotency-Key` | wajib |
| GET | `/safari/delegasi/{id}` | Detail delegasi | - | wajib |
| GET | `/safari/jurnal` | Daftar jurnal harian | - | wajib |
| POST | `/safari/jurnal` | Buat jurnal harian | `Idempotency-Key` | wajib |
| POST | `/safari/jurnal/approve` | Approval/reject jurnal (per delegasi) | `Idempotency-Key` | wajib |
| GET | `/safari/sidak` | Daftar laporan sidak | - | wajib |
| POST | `/safari/sidak` | Buat laporan sidak | `Idempotency-Key` | wajib |

## Authz & scope

- Permission API key: `safari:read`, `safari:write`.
- Titik/delegasi/sidak: `OWNER`/`ADMIN_BIDANG_SAFARI`/`PW`/`PC` (sesuai matriks). Jurnal dibuat oleh `DELEGASI_SAFARI_DAERAH` untuk delegasi miliknya (harus `AKTIF`). Approval oleh `OWNER`/`ADMIN_BIDANG_SAFARI`/`PW`/`PC`/`PANITIA_SAFARI_DAERAH`.
- Audit dicatat untuk approval jurnal dan pembuatan laporan sidak.
- `shortcut:` Titik/Delegasi belum memiliki field pemilik organisasi; scoping wilayah PW/PC dan panitia belum dibatasi ketat di query (hanya guard role/ownership delegasi pribadi).

## Envelope & error

`{ success, data, meta?, requestId, code? }` dengan kode stabil (`UNAUTHORIZED|FORBIDDEN|NOT_FOUND|CONFLICT|VALIDATION_ERROR|RATE_LIMITED|INTERNAL_ERROR`).
