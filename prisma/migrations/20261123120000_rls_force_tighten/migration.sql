-- FORCE RLS + remove unset-scope fallback. Applied after lim_app runtime switch.
-- SELF clause preserved for LaporanMingguan, Lembaga, Letter, Penugasan (select/update).

DO $$
DECLARE t text;
DECLARE self_tables text[] := ARRAY['LaporanMingguan','Lembaga','Letter','Penugasan'];
DECLARE tables text[] := ARRAY[
  'DaerahBinaan','DelegasiSafari','EvaluasiInduk','EvaluasiKasus','KontenDakwah',
  'LaporanMingguan','Lembaga','Letter','Penugasan','PenugasanPesantren',
  'PermohonanGuruBantu','SekolahMitra','TitikSafari'
];
DECLARE has_self boolean;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    has_self := t = ANY(self_tables);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_tenant_select', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_tenant_insert', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_tenant_update', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', t || '_tenant_delete', t);

    IF has_self THEN
      EXECUTE format($p$CREATE POLICY %I ON %I FOR SELECT USING (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true)) OR (current_setting('app.scope', true) = 'SELF' AND "createdById" = current_setting('app.user_id', true)))$p$, t||'_tenant_select', t);
      EXECUTE format($p$CREATE POLICY %I ON %I FOR INSERT WITH CHECK (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true)))$p$, t||'_tenant_insert', t);
      EXECUTE format($p$CREATE POLICY %I ON %I FOR UPDATE USING (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true)) OR (current_setting('app.scope', true) = 'SELF' AND "createdById" = current_setting('app.user_id', true))) WITH CHECK (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true)))$p$, t||'_tenant_update', t);
      EXECUTE format($p$CREATE POLICY %I ON %I FOR DELETE USING (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true)))$p$, t||'_tenant_delete', t);
    ELSE
      EXECUTE format($p$CREATE POLICY %I ON %I FOR SELECT USING (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true)))$p$, t||'_tenant_select', t);
      EXECUTE format($p$CREATE POLICY %I ON %I FOR INSERT WITH CHECK (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true)))$p$, t||'_tenant_insert', t);
      EXECUTE format($p$CREATE POLICY %I ON %I FOR UPDATE USING (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))) WITH CHECK (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true)))$p$, t||'_tenant_update', t);
      EXECUTE format($p$CREATE POLICY %I ON %I FOR DELETE USING (current_setting('app.scope', true) = 'PUSAT' OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true)))$p$, t||'_tenant_delete', t);
    END IF;
  END LOOP;
END $$;
