-- Allow PUBLIC scope to read verifiable, non-deleted letters only.
DROP POLICY IF EXISTS "Letter_tenant_select" ON "Letter";
CREATE POLICY "Letter_tenant_select" ON "Letter" FOR SELECT USING (
  current_setting('app.scope', true) = 'PUSAT'
  OR ("unitId" IS NOT NULL AND "unitId" = current_setting('app.unit_id', true))
  OR (current_setting('app.scope', true) = 'SELF' AND "createdById" = current_setting('app.user_id', true))
  OR (current_setting('app.scope', true) = 'PUBLIC' AND "verificationSlug" IS NOT NULL AND "deletedAt" IS NULL)
);
