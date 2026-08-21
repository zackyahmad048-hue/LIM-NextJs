-- CreateTable
CREATE TABLE "wajib_khidmah_members" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "alamat" TEXT,
    "kelas" TEXT,
    "posWajibKhidmah" TEXT,
    "tempatWajibKhidmah" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wajib_khidmah_members_pkey" PRIMARY KEY ("id")
);
