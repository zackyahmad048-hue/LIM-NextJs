/*
  Warnings:

  - You are about to drop the column `googleDocId` on the `administrative_document` table. All the data in the column will be lost.
  - You are about to drop the column `googleDocUrl` on the `administrative_document` table. All the data in the column will be lost.
  - You are about to drop the column `googleDocId` on the `outgoing_mail` table. All the data in the column will be lost.
  - You are about to drop the column `googleDocUrl` on the `outgoing_mail` table. All the data in the column will be lost.
  - You are about to drop the column `originalDriveFileId` on the `verified_letter` table. All the data in the column will be lost.
  - You are about to drop the column `processedDriveFileId` on the `verified_letter` table. All the data in the column will be lost.
  - You are about to drop the column `qrDriveFileId` on the `verified_letter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "administrative_document" DROP COLUMN "googleDocId",
DROP COLUMN "googleDocUrl";

-- AlterTable
ALTER TABLE "outgoing_mail" DROP COLUMN "googleDocId",
DROP COLUMN "googleDocUrl";

-- AlterTable
ALTER TABLE "verified_letter" DROP COLUMN "originalDriveFileId",
DROP COLUMN "processedDriveFileId",
DROP COLUMN "qrDriveFileId",
ADD COLUMN     "originalFileId" TEXT,
ADD COLUMN     "processedFileId" TEXT,
ADD COLUMN     "qrFileId" TEXT;
