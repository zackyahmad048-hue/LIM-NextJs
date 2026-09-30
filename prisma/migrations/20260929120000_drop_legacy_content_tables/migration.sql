-- Legacy content tables superseded by Payload CMS (see ADR-012).
-- Data verified migrated before drop:
--   posts      -> payload_posts      (0 rows in legacy table)
--   categories -> payload_categories  (1 row "LIMPAT" present in payload)
--   settings   -> payload_settings    (numbering identical; org:structure superseded)

-- DropTable
DROP TABLE "posts";

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "settings";

-- DropEnum
DROP TYPE "SettingType";
