-- CreateEnum
CREATE TYPE "PrayerMethod" AS ENUM ('KEMENAG', 'MUHAMMADIYAH', 'UMMAH_AL_QURA', 'EGYPTIAN', 'ISNA', 'MWL');

-- CreateEnum
CREATE TYPE "ObservationStatus" AS ENUM ('DRAFT', 'VERIFIED', 'CONFIRMED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RukyatResult" AS ENUM ('VISIBLE', 'NOT_VISIBLE', 'CLOUDY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "EclipseType" AS ENUM ('SOLAR', 'LUNAR');

-- CreateEnum
CREATE TYPE "HijriMethod" AS ENUM ('HISAB', 'RUKYAT', 'IMKANUR_RUKYAT', 'WUJUDUL_HILAL');

-- DropIndex
DROP INDEX "categories_deletedAt_idx";

-- DropIndex
DROP INDEX "categories_slug_idx";

-- DropIndex
DROP INDEX "categories_slug_key";

-- CreateTable
CREATE TABLE "falak_prayer_time" (
    "id" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL,
    "calculationMethod" "PrayerMethod" NOT NULL,
    "prayerDate" TIMESTAMP(3) NOT NULL,
    "fajr" TIMESTAMP(3) NOT NULL,
    "sunrise" TIMESTAMP(3) NOT NULL,
    "dhuhr" TIMESTAMP(3) NOT NULL,
    "asr" TIMESTAMP(3) NOT NULL,
    "maghrib" TIMESTAMP(3) NOT NULL,
    "isha" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "falak_prayer_time_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "falak_qibla" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "direction" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "falak_qibla_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "falak_hijri_calendar" (
    "id" TEXT NOT NULL,
    "gregorianDate" TIMESTAMP(3) NOT NULL,
    "hijriYear" INTEGER NOT NULL,
    "hijriMonth" INTEGER NOT NULL,
    "hijriDay" INTEGER NOT NULL,
    "method" "HijriMethod" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "falak_hijri_calendar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "falak_hisab" (
    "id" TEXT NOT NULL,
    "calculationDate" TIMESTAMP(3) NOT NULL,
    "locationName" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "parameters" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "calculatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "falak_hisab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "falak_rukyat" (
    "id" TEXT NOT NULL,
    "observationDate" TIMESTAMP(3) NOT NULL,
    "locationName" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "observerId" TEXT NOT NULL,
    "weather" TEXT NOT NULL,
    "result" "RukyatResult" NOT NULL,
    "notes" TEXT,
    "status" "ObservationStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "falak_rukyat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "falak_eclipse" (
    "id" TEXT NOT NULL,
    "eclipseType" "EclipseType" NOT NULL,
    "eclipseDate" TIMESTAMP(3) NOT NULL,
    "visibility" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "falak_eclipse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "falak_prayer_time_prayerDate_idx" ON "falak_prayer_time"("prayerDate");

-- CreateIndex
CREATE INDEX "falak_prayer_time_latitude_longitude_idx" ON "falak_prayer_time"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "falak_qibla_latitude_longitude_idx" ON "falak_qibla"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "falak_hijri_calendar_gregorianDate_idx" ON "falak_hijri_calendar"("gregorianDate");

-- CreateIndex
CREATE UNIQUE INDEX "falak_hijri_calendar_gregorianDate_method_key" ON "falak_hijri_calendar"("gregorianDate", "method");

-- CreateIndex
CREATE INDEX "falak_hisab_calculationDate_idx" ON "falak_hisab"("calculationDate");

-- CreateIndex
CREATE INDEX "falak_rukyat_observationDate_idx" ON "falak_rukyat"("observationDate");

-- CreateIndex
CREATE INDEX "falak_rukyat_status_idx" ON "falak_rukyat"("status");

-- CreateIndex
CREATE INDEX "falak_eclipse_eclipseDate_idx" ON "falak_eclipse"("eclipseDate");
