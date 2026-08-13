-- Wajib Khidmah: tempatWajibKhidmah single TEXT -> TEXT[] (multi jabatan)
-- Preserves existing values (NULL -> empty array, single value -> 1-element array).
ALTER TABLE "wajib_khidmah_members"
  ALTER COLUMN "tempatWajibKhidmah" TYPE TEXT[]
  USING CASE
    WHEN "tempatWajibKhidmah" IS NULL THEN ARRAY[]::TEXT[]
    ELSE ARRAY["tempatWajibKhidmah"]::TEXT[]
  END;

ALTER TABLE "wajib_khidmah_members"
  ALTER COLUMN "tempatWajibKhidmah" SET DEFAULT ARRAY[]::TEXT[];