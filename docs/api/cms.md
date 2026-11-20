# API Contract — Modul CMS (Portal)

**Status:** Batch 4  
**Base path:** `/api/v1`  
**Tag:** `CMS`  
**Spec:** `openapi/cms.yaml`

## Endpoint
| Method | Path | Deskripsi | Auth |
|---|---|---|---|
| GET | `/cms/categories` | Daftar kategori | publik |
| POST | `/cms/categories` | Buat kategori | OWNER/CONTENT_MANAGER |
| GET | `/cms/articles` | Daftar artikel (publik: PUBLISHED tanpa content; admin: semua) | publik/opsional |
| POST | `/cms/articles` | Buat artikel (DRAFT) | OWNER/CONTENT_MANAGER |
| GET | `/cms/articles/{id}` | Detail artikel by id | publik (PUBLISHED) / admin |
| POST | `/cms/articles/{id}/publish` | Publish artikel (Idempotency-Key) | OWNER/CONTENT_MANAGER |
| GET | `/cms/articles/slug/{slug}` | Detail artikel by slug (PUBLISHED) | publik |

Perubahan publish dicatat di audit log.
