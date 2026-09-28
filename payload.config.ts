import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import path from "path";
import { fileURLToPath } from "url";

import { Users } from "./collections/Users";
import { Posts } from "./collections/Posts";
import { Categories } from "./collections/Categories";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Bidang } from "./collections/Bidang";
import { Units } from "./collections/Units";
import { Officers } from "./collections/Officers";
import { AgendaBooks } from "./collections/AgendaBooks";
import { IncomingMails } from "./collections/IncomingMails";
import { OutgoingMails } from "./collections/OutgoingMails";
import { Dispositions } from "./collections/Dispositions";
import { AdministrativeDocuments } from "./collections/AdministrativeDocuments";
import { DocumentArchives } from "./collections/DocumentArchives";
import { Programs } from "./collections/Programs";
import { ProgramSchedules } from "./collections/ProgramSchedules";
import { ProgramCommittees } from "./collections/ProgramCommittees";
import { ProgramDocumentations } from "./collections/ProgramDocumentations";
import { FalakEclipses } from "./collections/FalakEclipses";
import { FalakHijriCalendars } from "./collections/FalakHijriCalendars";
import { FalakHisabs } from "./collections/FalakHisabs";
import { FalakPrayerTimes } from "./collections/FalakPrayerTimes";
import { FalakQiblas } from "./collections/FalakQiblas";
import { FalakRukyats } from "./collections/FalakRukyats";
import { GoogleDriveConnections } from "./collections/GoogleDriveConnections";
import { WajibKhidmahLembagas } from "./collections/WajibKhidmahLembagas";
import { WajibKhidmahMembers } from "./collections/WajibKhidmahMembers";
import { Participants } from "./collections/Participants";
import { Attendances } from "./collections/Attendances";
import { Settings } from "./globals/Settings";
import { OrganizationStructure } from "./globals/OrganizationStructure";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  collections: [Users, Posts, Categories, Media, Pages, Bidang, Units, Officers, AgendaBooks, IncomingMails, OutgoingMails, Dispositions, AdministrativeDocuments, DocumentArchives, Programs, ProgramSchedules, ProgramCommittees, Participants, Attendances, ProgramDocumentations, WajibKhidmahLembagas, WajibKhidmahMembers, FalakPrayerTimes, FalakQiblas, FalakHijriCalendars, FalakHisabs, FalakRukyats, FalakEclipses, GoogleDriveConnections],
  globals: [Settings, OrganizationStructure],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, "app/(payload)/admin/importMap.js"),
    },
  },
  secret: process.env.PAYLOAD_SECRET || process.env.BETTER_AUTH_SECRET || "CHANGE-ME",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    // push disabled: shared Neon DB with Prisma — schema applied via migrations/
    push: false,
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
});
