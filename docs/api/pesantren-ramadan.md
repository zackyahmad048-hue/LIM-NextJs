# API Contract — Modul Pesantren Ramadan

**Status:** Batch 3  
**Base path:** `/api/v1`  
**Tag:** `Pesantren Ramadan`  
**Spec:** `openapi/pesantren-ramadan.yaml`

## Endpoint
| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| GET/POST | `/pesantren/sekolah` | Sekolah mitra | read: OWNER/ADMIN_BIDANG_PR/PW/PC/PENGAJAR; create: OWNER/ADMIN_BIDANG_PR/PW/PC |
| GET/POST | `/pesantren/materi` | Bank materi | read: roles di atas; create: OWNER/ADMIN_BIDANG_PR |
| GET/POST | `/pesantren/penugasan` | Penugasan pesantren | create: OWNER/ADMIN_BIDANG_PR/PW/PC; pengajar hanya lihat miliknya |
| GET/POST | `/pesantren/laporan-pengajar` | Laporan harian pengajar | create: PENGAJAR_PESANTREN_RAMADAN (Idempotency-Key) |
| GET/POST | `/pesantren/laporan-koordinator` | Laporan harian koordinator | create: OWNER/ADMIN_BIDANG_PR/PW/PC (Idempotency-Key) |
| GET/POST | `/pesantren/umpan-balik-pusat` | Umpan balik pusat | create: OWNER/ADMIN_BIDANG_PR |
| GET/POST | `/pesantren/umpan-balik-peserta` | Umpan balik peserta | create: OWNER/ADMIN_BIDANG_PR/PW/PC |

`shortcut:` `ADMIN_BIDANG_PR` = `ADMIN_BIDANG_PESANTREN_RAMADAN`. Scoping wilayah PW/PC untuk entitas pesantren belum dibatasi ketat di query; pengajar dibatasi ke penugasan/laporan miliknya.
