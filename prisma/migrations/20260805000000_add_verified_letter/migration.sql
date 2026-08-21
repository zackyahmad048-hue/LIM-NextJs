-- CreateTable
CREATE TABLE "verified_letter" (
    "id" TEXT NOT NULL,
    "letterType" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "issuer" TEXT,
    "originalFileUrl" TEXT NOT NULL,
    "processedPdfUrl" TEXT NOT NULL,
    "qrPngUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verified_letter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verified_letter_verificationCode_key" ON "verified_letter"("verificationCode");

-- CreateIndex
CREATE INDEX "verified_letter_letterType_idx" ON "verified_letter"("letterType");

-- CreateIndex
CREATE INDEX "verified_letter_registrationNumber_idx" ON "verified_letter"("registrationNumber");

-- CreateIndex
CREATE INDEX "verified_letter_verifiedAt_idx" ON "verified_letter"("verifiedAt");
