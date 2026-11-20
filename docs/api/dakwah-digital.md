# API Contract — Modul Dakwah Digital

**Status:** Batch 4  
**Base path:** `/api/v1`  
**Tag:** `Dakwah Digital`  
**Spec:** `openapi/dakwah-digital.yaml`

## Endpoint
| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| GET | `/dakwah/konten` | Daftar konten (paginasi, filter status/jenis) | OWNER/CONTENT_MANAGER/PW/PC |
| POST | `/dakwah/konten` | Upload konten (PW/PC → `PENDING_REVIEW`, pusat → `DRAFT`) | OWNER/CONTENT_MANAGER/PW/PC |
| POST | `/dakwah/konten/{id}/approve` | Approve (`PENDING_REVIEW`→`APPROVED`) | OWNER/CONTENT_MANAGER |
| POST | `/dakwah/konten/{id}/publish` | Publish (`APPROVED`→`PUBLISHED`) | OWNER/CONTENT_MANAGER |
| POST | `/dakwah/events/register` | Pendaftaran event (publik, event harus PUBLISHED, Idempotency-Key) | publik |

Audit dicatat untuk approve/publish. `shortcut:` scoping unggahan PW/PC per organisasi belum dibatasi ketat di list (bergantung field pemilik org pada konten).
