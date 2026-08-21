/*
  Warnings:

  - Changed the column `jenisSatuanPendidikan` on the `wajib_khidmah_lembaga` table from a scalar field to a list field. Existing single values are converted to arrays (NULL becomes empty array).

*/
-- AlterTable
ALTER TABLE "wajib_khidmah_lembaga"
ALTER COLUMN "jenisSatuanPendidikan" SET DEFAULT ARRAY[]::"WajibKhidmahSatuanPendidikan"[],
ALTER COLUMN "jenisSatuanPendidikan" SET DATA TYPE "WajibKhidmahSatuanPendidikan"[] USING CASE
  WHEN "jenisSatuanPendidikan" IS NULL THEN ARRAY[]::"WajibKhidmahSatuanPendidikan"[]
  ELSE ARRAY["jenisSatuanPendidikan"]
END;