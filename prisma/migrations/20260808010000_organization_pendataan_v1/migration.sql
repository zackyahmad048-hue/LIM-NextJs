-- CreateEnum
CREATE TYPE "UnitLevel" AS ENUM ('PP', 'PW', 'PC');

-- CreateTable
CREATE TABLE "organization_unit" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" "UnitLevel" NOT NULL,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "organization_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "officer" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "isLeader" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT,
    "email" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "officer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_unit_code_key" ON "organization_unit"("code");

-- CreateIndex
CREATE INDEX "organization_unit_parentId_idx" ON "organization_unit"("parentId");

-- CreateIndex
CREATE INDEX "organization_unit_level_idx" ON "organization_unit"("level");

-- CreateIndex
CREATE INDEX "organization_unit_deletedAt_idx" ON "organization_unit"("deletedAt");

-- CreateIndex
CREATE INDEX "officer_unitId_idx" ON "officer"("unitId");

-- CreateIndex
CREATE INDEX "officer_deletedAt_idx" ON "officer"("deletedAt");

-- AddForeignKey
ALTER TABLE "organization_unit" ADD CONSTRAINT "organization_unit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "organization_unit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "officer" ADD CONSTRAINT "officer_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "organization_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

