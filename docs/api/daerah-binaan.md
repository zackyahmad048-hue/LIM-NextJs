# API Contract — Modul Daerah Binaan

**Status:** Batch 4  
**Base path:** `/api/v1`  
**Tag:** `Daerah Binaan`  
**Spec:** `openapi/daerah-binaan.yaml`

## Endpoint
| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| GET | `/daerah-binaan/daerah` | Daftar daerah binaan | OWNER/PW/PC |
| POST | `/daerah-binaan/daerah` | Ajukan daerah binaan | OWNER/PW/PC |
| GET | `/daerah-binaan/laporan` | Daftar laporan bulanan | OWNER/PW/PC |
| POST | `/daerah-binaan/laporan` | Buat laporan bulanan (Idempotency-Key) | OWNER/PW/PC |

PW/PC dibatasi ke wilayah unit organisasinya pada create/laporan (berdasarkan `unit.wilayah` vs provinsi/kabupaten). `shortcut:` filter list wilayah PW/PC belum diterapkan di query.
