-- AlterTable
ALTER TABLE "account" ADD COLUMN     "issuer" TEXT;

-- Backfill existing credential accounts (email & password provider)
UPDATE "account"
SET "issuer" = 'local:credential'
WHERE "providerId" = 'credential'
  AND "issuer" IS NULL;

-- Any legacy/unknown account falls back to the credential issuer too,
-- since the app only provisions local (email/password) accounts today.
UPDATE "account"
SET "issuer" = 'local:credential'
WHERE "issuer" IS NULL;

-- AlterTable
ALTER TABLE "account" ALTER COLUMN "issuer" SET NOT NULL;