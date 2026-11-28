-- ROLLOUT-SAFE RLS (F2)
-- Enables RLS with permissive fallback when app.scope is unset.
-- TODO(F2-tighten): remove unset-scope fallback and add FORCE RLS after withTenant wiring + lim_app role.

DO $$
DECLARE
  r record;
  has_created_by boolean;
BEGIN
  FOR r IN
    SELECT unnest(ARRAY[
      'Lembaga','Penugasan','LaporanMingguan','PermohonanGuruBantu',
      'EvaluasiKasus','EvaluasiInduk','Letter','TitikSafari','DelegasiSafari',
      'SekolahMitra','PenugasanPesantren','DaerahBinaan','KontenDakwah'
    ]) AS tbl
  LOOP
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = r.tbl AND column_name = 'createdById'
    ) INTO has_created_by;

    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.tbl);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.tbl || '_tenant_select', r.tbl);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.tbl || '_tenant_insert', r.tbl);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.tbl || '_tenant_update', r.tbl);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.tbl || '_tenant_delete', r.tbl);

    IF has_created_by THEN
      EXECUTE format($p$
        CREATE POLICY %I ON %I FOR SELECT USING (
          current_setting('app.scope', true) IS NULL
          OR current_setting('app.scope', true) = ''
          OR current_setting('app.scope', true) = 'PUSAT'
          OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
          OR (current_setting('app.scope', true) = 'SELF' AND "createdById" = current_setting('app.user_id', true))
        )
      $p$, r.tbl || '_tenant_select', r.tbl);
      EXECUTE format($p$
        CREATE POLICY %I ON %I FOR UPDATE USING (
          current_setting('app.scope', true) IS NULL
          OR current_setting('app.scope', true) = ''
          OR current_setting('app.scope', true) = 'PUSAT'
          OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
          OR (current_setting('app.scope', true) = 'SELF' AND "createdById" = current_setting('app.user_id', true))
        ) WITH CHECK (
          current_setting('app.scope', true) IS NULL
          OR current_setting('app.scope', true) = ''
          OR current_setting('app.scope', true) = 'PUSAT'
          OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
        )
      $p$, r.tbl || '_tenant_update', r.tbl);
    ELSE
      EXECUTE format($p$
        CREATE POLICY %I ON %I FOR SELECT USING (
          current_setting('app.scope', true) IS NULL
          OR current_setting('app.scope', true) = ''
          OR current_setting('app.scope', true) = 'PUSAT'
          OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
        )
      $p$, r.tbl || '_tenant_select', r.tbl);
      EXECUTE format($p$
        CREATE POLICY %I ON %I FOR UPDATE USING (
          current_setting('app.scope', true) IS NULL
          OR current_setting('app.scope', true) = ''
          OR current_setting('app.scope', true) = 'PUSAT'
          OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
        ) WITH CHECK (
          current_setting('app.scope', true) IS NULL
          OR current_setting('app.scope', true) = ''
          OR current_setting('app.scope', true) = 'PUSAT'
          OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
        )
      $p$, r.tbl || '_tenant_update', r.tbl);
    END IF;

    EXECUTE format($p$
      CREATE POLICY %I ON %I FOR INSERT WITH CHECK (
        current_setting('app.scope', true) IS NULL
        OR current_setting('app.scope', true) = ''
        OR current_setting('app.scope', true) = 'PUSAT'
        OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
      )
    $p$, r.tbl || '_tenant_insert', r.tbl);

    EXECUTE format($p$
      CREATE POLICY %I ON %I FOR DELETE USING (
        current_setting('app.scope', true) IS NULL
        OR current_setting('app.scope', true) = ''
        OR current_setting('app.scope', true) = 'PUSAT'
        OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
      )
    $p$, r.tbl || '_tenant_delete', r.tbl);
  END LOOP;
END $$;
