# API Contract — Modul Wajib Khidmah

**Status:** Batch 2  
**Base path:** `/api/v1`  
**Tag:** `Wajib Khidmah`  
**Spec:** `openapi/wajib-khidmah.yaml`, gabungan `openapi/v1.json`

## Endpoint

| Method | Path | Deskripsi | Idempotensi | Auth |
|---|---|---|---|---|
| GET | `/wajib-khidmah/penugasan` | Daftar penugasan (offset) | - | wajib |
| GET | `/wajib-khidmah/penugasan/{id}` | Detail penugasan | - | wajib |
| GET | `/wajib-khidmah/laporan` | Daftar laporan mingguan | - | wajib |
| POST | `/wajib-khidmah/laporan` | Submit laporan mingguan | `Idempotency-Key` | wajib |
| GET | `/wajib-khidmah/laporan/{id}` | Detail laporan | - | wajib |
| GET | `/wajib-khidmah/evaluasi-kasus` | Daftar evaluasi kasus | - | wajib |
| POST | `/wajib-khidmah/evaluasi-kasus` | Buat evaluasi kasus | `Idempotency-Key` | wajib |
| GET | `/wajib-khidmah/evaluasi-induk` | Daftar evaluasi induk | - | wajib |
| POST | `/wajib-khidmah/evaluasi-induk` | Buat evaluasi induk | `Idempotency-Key` | wajib |

## Authz & scope

- Permission API key: `wk:read`, `wk:write`.
- RBAC: `OWNER`/`TIM_WAJIB_KHIDMAH` (penuh global), `PW`/`PC` (baca/update/review), `GURU_BANTU`/`LEMBAGA_EKSTERNAL` (baca/buat/update milik sendiri untuk laporan).
- **Submit laporan:** hanya `GURU_BANTU` dan `LEMBAGA_EKSTERNAL`; penugasan harus `DIAKTIFKAN`, lembaga `MITRA_AKTIF`, 1 laporan per pelapor per periode per penugasan. Audit `LAPORAN_MINGGUAN_SUBMITTED`.
- **Identitas pengisi:** untuk akun ORGANIZATIONAL, `namaPengisi`/`jabatanPengisi` diturunkan server (tidak dipercaya dari client).
- **Evaluasi kasus/induk:** hanya `OWNER`/`TIM_WAJIB_KHIDMAH` (audit dicatat).
- `shortcut:` scope wilayah PW/PC belum dibatasi per unit wilayah pada query penugasan/laporan karena relasi wilayah eksplisit belum tersedia; GURU_BANTU dibatasi ke profil/penugasan miliknya, LEMBAGA_EKSTERNAL ke lembaganya.

## Envelope & error

Sama seperti modul lain: `{ success, data, meta?, requestId, code? }`, kode stabil `UNAUTHORIZED|FORBIDDEN|NOT_FOUND|CONFLICT|VALIDATION_ERROR|RATE_LIMITED|INTERNAL_ERROR`.
