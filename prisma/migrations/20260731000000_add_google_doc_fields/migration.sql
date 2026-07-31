-- AlterTable
ALTER TABLE "outgoing_mail" ADD COLUMN "googleDocId" TEXT,
ADD COLUMN "googleDocUrl" TEXT;

-- AlterTable
ALTER TABLE "administrative_document" ADD COLUMN "googleDocId" TEXT,
ADD COLUMN "googleDocUrl" TEXT;
