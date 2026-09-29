import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_posts" ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE;
  `)
  await db.execute(sql`
   ALTER TABLE "payload_categories" ADD COLUMN "deleted_at" TIMESTAMP WITH TIME ZONE;
  `)
  await db.execute(sql`
   ALTER TABLE "payload_users" ADD COLUMN "auth_user_id" VARCHAR;
  `)
  await db.execute(sql`
   ALTER TABLE "payload_users" ADD CONSTRAINT "payload_users_auth_user_id_unique" UNIQUE ("auth_user_id");
  `)
  await db.execute(sql`
   CREATE INDEX "payload_users_auth_user_id_idx" ON "payload_users" USING btree ("auth_user_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_posts" DROP COLUMN IF EXISTS "deleted_at";
  `)
  await db.execute(sql`
   ALTER TABLE "payload_categories" DROP COLUMN IF EXISTS "deleted_at";
  `)
  await db.execute(sql`
   ALTER TABLE "payload_users" DROP CONSTRAINT IF EXISTS "payload_users_auth_user_id_unique";
  `)
  await db.execute(sql`
   DROP INDEX IF EXISTS "payload_users_auth_user_id_idx";
  `)
  await db.execute(sql`
   ALTER TABLE "payload_users" DROP COLUMN IF EXISTS "auth_user_id";
  `)
}
