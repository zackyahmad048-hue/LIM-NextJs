-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('BLOB', 'GOOGLE_DRIVE');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OutgoingMailStatus" ADD VALUE 'SUBMITTED';
ALTER TYPE "OutgoingMailStatus" ADD VALUE 'REVIEWED';
ALTER TYPE "OutgoingMailStatus" ADD VALUE 'REJECTED';
ALTER TYPE "OutgoingMailStatus" ADD VALUE 'SIGNED';

-- AlterTable
ALTER TABLE "incoming_mail" ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "storageKey" TEXT,
ADD COLUMN     "storageProvider" "StorageProvider" NOT NULL DEFAULT 'BLOB';

-- AlterTable
ALTER TABLE "outgoing_mail" DROP COLUMN "documentNumber",
ADD COLUMN     "archivedAt" TIMESTAMP(3),
ADD COLUMN     "categoryCode" TEXT,
ADD COLUMN     "fullNumber" TEXT,
ADD COLUMN     "levelCode" TEXT,
ADD COLUMN     "periodYear" INTEGER,
ADD COLUMN     "qrFileId" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "romanMonth" TEXT,
ADD COLUMN     "sentAt" TIMESTAMP(3),
ADD COLUMN     "sequence" INTEGER,
ADD COLUMN     "signedAt" TIMESTAMP(3),
ADD COLUMN     "signedById" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "submittedById" TEXT,
ADD COLUMN     "verificationCode" TEXT;

-- CreateTable
CREATE TABLE "google_drive_connection" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "driveFolderId" TEXT,
    "driveFolderName" TEXT,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "google_drive_connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "outgoing_mail_periodYear_sequence_key" ON "outgoing_mail"("periodYear", "sequence");

-- CreateIndex
CREATE UNIQUE INDEX "outgoing_mail_fullNumber_key" ON "outgoing_mail"("fullNumber");

-- CreateIndex
CREATE UNIQUE INDEX "outgoing_mail_verificationCode_key" ON "outgoing_mail"("verificationCode");

