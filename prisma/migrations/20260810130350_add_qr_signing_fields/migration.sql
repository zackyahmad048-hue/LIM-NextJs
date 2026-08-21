-- AlterTable
ALTER TABLE "outgoing_mail" ADD COLUMN     "ketuaName" TEXT,
ADD COLUMN     "ketuaPosition" TEXT,
ADD COLUMN     "qrKetuaPosition" JSONB,
ADD COLUMN     "qrSekretarisPosition" JSONB,
ADD COLUMN     "qrVerifikasiPosition" JSONB,
ADD COLUMN     "sekretarisName" TEXT,
ADD COLUMN     "sekretarisPosition" TEXT;
