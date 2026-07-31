-- CreateTable
CREATE TABLE "imsakiyah" (
    "id" TEXT NOT NULL,
    "no" INTEGER NOT NULL,
    "gregorianDate" TIMESTAMP(3) NOT NULL,
    "dayName" TEXT NOT NULL,
    "javaneseDay" TEXT NOT NULL,
    "ramadanDay" INTEGER NOT NULL,
    "hijriDate" INTEGER NOT NULL,
    "hijriMonth" TEXT NOT NULL,
    "hijriYear" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "elevation" DOUBLE PRECISION,
    "googleMapsLink" TEXT,
    "imsak" TEXT NOT NULL,
    "subuh" TEXT NOT NULL,
    "terbit" TEXT NOT NULL,
    "dhuha" TEXT NOT NULL,
    "dzuhur" TEXT NOT NULL,
    "ashar" TEXT NOT NULL,
    "maghrib" TEXT NOT NULL,
    "isya" TEXT NOT NULL,
    "moonPhase" TEXT,
    "eclipseData" TEXT,
    "eclipseTime" TEXT,
    "hilalAltitude" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "imsakiyah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "imsakiyah_gregorianDate_idx" ON "imsakiyah"("gregorianDate");