-- DRAFT ONLY - DO NOT APPLY until all tenant-scoped queries use withTenant() and unitId backfill is complete.
-- Target: PostgreSQL (Neon). Prisma 6. Runtime role: lim_app (NOSUPERUSER, NOBYPASSRLS).

-- 1) Roles (run as owner/admin)
-- CREATE ROLE lim_app LOGIN PASSWORD '...';
-- GRANT USAGE ON SCHEMA public TO lim_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lim_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO lim_app;

-- 2) Helper: tenant match
-- Policies expect:
--   current_setting('app.scope', true) IN ('PUSAT','UNIT','LEMBAGA','SELF','PUBLIC')
--   current_setting('app.unit_id', true)
--   current_setting('app.user_id', true)

-- 3) Example table policy (repeat for tenant-scoped tables)
-- ALTER TABLE "Letter" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Letter" FORCE ROW LEVEL SECURITY;
-- DROP POLICY IF EXISTS letter_select ON "Letter";
-- CREATE POLICY letter_select ON "Letter" FOR SELECT USING (
--   current_setting('app.scope', true) = 'PUSAT'
--   OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
--   OR (current_setting('app.scope', true) = 'SELF' AND "createdById" = current_setting('app.user_id', true))
-- );
-- DROP POLICY IF EXISTS letter_write ON "Letter" FOR INSERT WITH CHECK (
--   current_setting('app.scope', true) = 'PUSAT'
--   OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
-- );
-- DROP POLICY IF EXISTS letter_update ON "Letter" FOR UPDATE USING (
--   current_setting('app.scope', true) = 'PUSAT'
--   OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
-- ) WITH CHECK (
--   current_setting('app.scope', true) = 'PUSAT'
--   OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
-- );

-- 4) Apply pattern to: Lembaga, Penugasan, LaporanMingguan, PermohonanGuruBantu,
--    EvaluasiKasus, EvaluasiInduk, TitikSafari, DelegasiSafari, SekolahMitra,
--    PenugasanPesantren, DaerahBinaan, KontenDakwah.
-- Child tables can use EXISTS policy against parent aggregate.

-- 5) Rollout order:
-- a. Backfill unitId on all tenant-scoped rows.
-- b. Wrap all tenant reads/writes with withTenant().
-- c. Create lim_app role and switch DATABASE_URL to lim_app.
-- d. Apply ENABLE+FORCE RLS + policies in staging.
-- e. Run P1 isolation tests before production.
