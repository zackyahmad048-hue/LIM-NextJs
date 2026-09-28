import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_users_role" AS ENUM('super-admin', 'administrator', 'editor', 'operator', 'sekretaris', 'viewer');
  CREATE TYPE "public"."enum_payload_media_access" AS ENUM('public', 'private');
  CREATE TABLE "payload_users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload_users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_payload_users_role" DEFAULT 'editor',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" varchar,
  	"thumbnail" varchar,
  	"category_id" integer,
  	"published" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"original_name" varchar,
  	"mime_type" varchar,
  	"size" numeric,
  	"url" varchar,
  	"access" "enum_payload_media_access" DEFAULT 'public',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"payload_users_id" integer,
  	"payload_posts_id" integer,
  	"payload_categories_id" integer,
  	"payload_media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"payload_users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Lembaga Ittihadul Muballighin',
  	"site_description" varchar,
  	"hero_config" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload_users_sessions" ADD CONSTRAINT "payload_users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_posts" ADD CONSTRAINT "payload_posts_category_id_payload_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."payload_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("payload_users_id") REFERENCES "public"."payload_users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("payload_posts_id") REFERENCES "public"."payload_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("payload_categories_id") REFERENCES "public"."payload_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("payload_media_id") REFERENCES "public"."payload_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("payload_users_id") REFERENCES "public"."payload_users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_users_sessions_order_idx" ON "payload_users_sessions" USING btree ("_order");
  CREATE INDEX "payload_users_sessions_parent_id_idx" ON "payload_users_sessions" USING btree ("_parent_id");
  CREATE INDEX "payload_users_updated_at_idx" ON "payload_users" USING btree ("updated_at");
  CREATE INDEX "payload_users_created_at_idx" ON "payload_users" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_users_email_idx" ON "payload_users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_posts_slug_idx" ON "payload_posts" USING btree ("slug");
  CREATE INDEX "payload_posts_category_idx" ON "payload_posts" USING btree ("category_id");
  CREATE INDEX "payload_posts_updated_at_idx" ON "payload_posts" USING btree ("updated_at");
  CREATE INDEX "payload_posts_created_at_idx" ON "payload_posts" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_categories_slug_idx" ON "payload_categories" USING btree ("slug");
  CREATE INDEX "payload_categories_updated_at_idx" ON "payload_categories" USING btree ("updated_at");
  CREATE INDEX "payload_categories_created_at_idx" ON "payload_categories" USING btree ("created_at");
  CREATE INDEX "payload_media_updated_at_idx" ON "payload_media" USING btree ("updated_at");
  CREATE INDEX "payload_media_created_at_idx" ON "payload_media" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_payload_users_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_posts_id");
  CREATE INDEX "payload_locked_documents_rels_payload_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_categories_id");
  CREATE INDEX "payload_locked_documents_rels_payload_media_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_payload_users_id_idx" ON "payload_preferences_rels" USING btree ("payload_users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload_users_sessions" CASCADE;
  DROP TABLE "payload_users" CASCADE;
  DROP TABLE "payload_posts" CASCADE;
  DROP TABLE "payload_categories" CASCADE;
  DROP TABLE "payload_media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "payload_settings" CASCADE;
  DROP TYPE "public"."enum_payload_users_role";
  DROP TYPE "public"."enum_payload_media_access";`)
}
