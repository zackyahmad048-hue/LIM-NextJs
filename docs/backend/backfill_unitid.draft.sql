-- DRAFT - review before running. Backfill unitId for tenant-scoped tables.
-- Run in a transaction per table/batch. Verify counts before/after.

-- Letter: derive from creator's organizational account
-- UPDATE "Letter" l
-- SET "unitId" = oa."unitId"
-- FROM "OrganizationalAccount" oa
-- WHERE l."unitId" IS NULL AND l."createdById" = oa."userId";

-- LaporanMingguan: inherit from Penugasan
-- UPDATE "LaporanMingguan" lm
-- SET "unitId" = p."unitId"
-- FROM "Penugasan" p
-- WHERE lm."unitId" IS NULL AND lm."penugasanId" = p.id AND p."unitId" IS NOT NULL;

-- Penugasan: derive from Lembaga
-- UPDATE "Penugasan" p
-- SET "unitId" = l."unitId"
-- FROM "Lembaga" l
-- WHERE p."unitId" IS NULL AND p."lembagaId" = l.id AND l."unitId" IS NOT NULL;

-- Lembaga: derive from owner user's organizational account (if any)
-- UPDATE "Lembaga" l
-- SET "unitId" = oa."unitId"
-- FROM "OrganizationalAccount" oa
-- WHERE l."unitId" IS NULL AND l."userId" = oa."userId";

-- DaerahBinaan: derive from picLokal organizational account
-- UPDATE "DaerahBinaan" d
-- SET "unitId" = oa."unitId"
-- FROM "OrganizationalAccount" oa
-- WHERE d."unitId" IS NULL AND d."picLokalId" = oa."userId";

-- Verify remaining nulls:
-- SELECT 'Letter', COUNT(*) FROM "Letter" WHERE "unitId" IS NULL
-- UNION ALL SELECT 'LaporanMingguan', COUNT(*) FROM "LaporanMingguan" WHERE "unitId" IS NULL
-- UNION ALL SELECT 'Penugasan', COUNT(*) FROM "Penugasan" WHERE "unitId" IS NULL;
