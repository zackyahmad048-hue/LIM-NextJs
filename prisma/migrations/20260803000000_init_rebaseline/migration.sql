-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'UNPUBLISH', 'VERIFY', 'IMPORT', 'EXPORT', 'OPEN', 'CLOSE', 'COMPLETE', 'CANCEL', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'ON_GOING', 'COMPLETED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommitteeStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "SettingType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON');

-- CreateEnum
CREATE TYPE "PermissionEffect" AS ENUM ('ALLOW', 'DENY');

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

-- CreateEnum
CREATE TYPE "IncomingMailStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "OutgoingMailStatus" AS ENUM ('DRAFT', 'APPROVED', 'SENT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DispositionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AdministrativeDocumentStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('UNDANGAN', 'PERMOHONAN', 'PEMBERITAHUAN', 'INSTRUKSI', 'KETERANGAN', 'KEPUTUSAN', 'TERIMA_KASIH', 'LAINNYA');

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "effect" "PermissionEffect" NOT NULL DEFAULT 'ALLOW',

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" "SettingType" NOT NULL DEFAULT 'STRING',
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "description" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "thumbnail" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "categoryId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "program" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "organizerId" TEXT,
    "personInChargeId" TEXT,
    "status" "ProgramStatus" NOT NULL DEFAULT 'DRAFT',
    "registrationOpen" TIMESTAMP(3),
    "registrationClose" TIMESTAMP(3),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_schedule" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "venueId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "program_schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_committee" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" "CommitteeStatus" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "program_committee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participant" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrationStatus" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "status" "AttendanceStatus" NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_documentation" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "mediaId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "program_documentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incoming_mail" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "senderAddress" TEXT,
    "receivedDate" TIMESTAMP(3) NOT NULL,
    "status" "IncomingMailStatus" NOT NULL DEFAULT 'RECEIVED',
    "classification" TEXT,
    "category" TEXT,
    "notes" TEXT,
    "attachmentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "incoming_mail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outgoing_mail" (
    "id" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "recipient" TEXT,
    "subject" TEXT NOT NULL,
    "senderName" TEXT,
    "mailDate" TIMESTAMP(3) NOT NULL,
    "status" "OutgoingMailStatus" NOT NULL DEFAULT 'DRAFT',
    "documentNumber" TEXT,
    "documentType" "DocumentType",
    "content" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "attachmentUrl" TEXT,
    "googleDocId" TEXT,
    "googleDocUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "outgoing_mail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disposition" (
    "id" TEXT NOT NULL,
    "incomingMailId" TEXT NOT NULL,
    "assignedToId" TEXT NOT NULL,
    "instruction" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "status" "DispositionStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disposition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administrative_document" (
    "id" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "status" "AdministrativeDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedById" TEXT,
    "submittedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "googleDocId" TEXT,
    "googleDocUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "administrative_document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agenda_book" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "participants" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agenda_book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_archive" (
    "id" TEXT NOT NULL,
    "archiveNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "category" TEXT,
    "retentionYear" INTEGER,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_archive_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_slug_key" ON "roles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_slug_key" ON "permissions"("slug");

-- CreateIndex
CREATE INDEX "user_roles_userId_idx" ON "user_roles"("userId");

-- CreateIndex
CREATE INDEX "user_roles_roleId_idx" ON "user_roles"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_userId_roleId_key" ON "user_roles"("userId", "roleId");

-- CreateIndex
CREATE INDEX "role_permissions_roleId_idx" ON "role_permissions"("roleId");

-- CreateIndex
CREATE INDEX "role_permissions_permissionId_idx" ON "role_permissions"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "settings_key_key" ON "settings"("key");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "posts_slug_key" ON "posts"("slug");

-- CreateIndex
CREATE INDEX "posts_categoryId_idx" ON "posts"("categoryId");

-- CreateIndex
CREATE INDEX "posts_authorId_idx" ON "posts"("authorId");

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

-- CreateIndex
CREATE UNIQUE INDEX "program_code_key" ON "program"("code");

-- CreateIndex
CREATE INDEX "program_status_idx" ON "program"("status");

-- CreateIndex
CREATE INDEX "program_startDate_idx" ON "program"("startDate");

-- CreateIndex
CREATE INDEX "program_schedule_programId_idx" ON "program_schedule"("programId");

-- CreateIndex
CREATE INDEX "program_committee_programId_idx" ON "program_committee"("programId");

-- CreateIndex
CREATE INDEX "program_committee_userId_idx" ON "program_committee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "program_committee_programId_userId_key" ON "program_committee"("programId", "userId");

-- CreateIndex
CREATE INDEX "participant_programId_idx" ON "participant"("programId");

-- CreateIndex
CREATE INDEX "participant_userId_idx" ON "participant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "participant_programId_userId_key" ON "participant"("programId", "userId");

-- CreateIndex
CREATE INDEX "attendance_participantId_idx" ON "attendance"("participantId");

-- CreateIndex
CREATE INDEX "program_documentation_programId_idx" ON "program_documentation"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "incoming_mail_registrationNumber_key" ON "incoming_mail"("registrationNumber");

-- CreateIndex
CREATE INDEX "incoming_mail_status_idx" ON "incoming_mail"("status");

-- CreateIndex
CREATE INDEX "incoming_mail_receivedDate_idx" ON "incoming_mail"("receivedDate");

-- CreateIndex
CREATE INDEX "incoming_mail_registrationNumber_idx" ON "incoming_mail"("registrationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "outgoing_mail_registrationNumber_key" ON "outgoing_mail"("registrationNumber");

-- CreateIndex
CREATE INDEX "outgoing_mail_status_idx" ON "outgoing_mail"("status");

-- CreateIndex
CREATE INDEX "outgoing_mail_mailDate_idx" ON "outgoing_mail"("mailDate");

-- CreateIndex
CREATE INDEX "outgoing_mail_registrationNumber_idx" ON "outgoing_mail"("registrationNumber");

-- CreateIndex
CREATE INDEX "disposition_incomingMailId_idx" ON "disposition"("incomingMailId");

-- CreateIndex
CREATE INDEX "disposition_assignedToId_idx" ON "disposition"("assignedToId");

-- CreateIndex
CREATE INDEX "disposition_status_idx" ON "disposition"("status");

-- CreateIndex
CREATE UNIQUE INDEX "administrative_document_documentNumber_key" ON "administrative_document"("documentNumber");

-- CreateIndex
CREATE INDEX "administrative_document_status_idx" ON "administrative_document"("status");

-- CreateIndex
CREATE INDEX "administrative_document_documentType_idx" ON "administrative_document"("documentType");

-- CreateIndex
CREATE INDEX "administrative_document_documentNumber_idx" ON "administrative_document"("documentNumber");

-- CreateIndex
CREATE INDEX "agenda_book_date_idx" ON "agenda_book"("date");

-- CreateIndex
CREATE UNIQUE INDEX "document_archive_archiveNumber_key" ON "document_archive"("archiveNumber");

-- CreateIndex
CREATE INDEX "document_archive_archiveNumber_idx" ON "document_archive"("archiveNumber");

-- CreateIndex
CREATE INDEX "document_archive_documentType_idx" ON "document_archive"("documentType");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program" ADD CONSTRAINT "program_personInChargeId_fkey" FOREIGN KEY ("personInChargeId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_schedule" ADD CONSTRAINT "program_schedule_programId_fkey" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_committee" ADD CONSTRAINT "program_committee_programId_fkey" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_committee" ADD CONSTRAINT "program_committee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant" ADD CONSTRAINT "participant_programId_fkey" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant" ADD CONSTRAINT "participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_documentation" ADD CONSTRAINT "program_documentation_programId_fkey" FOREIGN KEY ("programId") REFERENCES "program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disposition" ADD CONSTRAINT "disposition_incomingMailId_fkey" FOREIGN KEY ("incomingMailId") REFERENCES "incoming_mail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

