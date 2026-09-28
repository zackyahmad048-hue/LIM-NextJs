import "dotenv/config";

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

const ADMIN_ROUTE = "/cms";
const API_ROUTE = "/payload-api";

const secret = process.env.PAYLOAD_SECRET || process.env.BETTER_AUTH_SECRET;

if (!secret) {
  throw new Error(
    "Missing PAYLOAD_SECRET. Generate one with `openssl rand -base64 32` and add it to .env. " +
      "BETTER_AUTH_SECRET is accepted as a fallback.",
  );
}

export default buildConfig({
  collections: [Users, Posts, Categories, Media, Pages, Bidang, Units, Officers, AgendaBooks, IncomingMails, OutgoingMails, Dispositions, AdministrativeDocuments, DocumentArchives, Programs, ProgramSchedules, ProgramCommittees, Participants, Attendances, ProgramDocumentations, WajibKhidmahLembagas, WajibKhidmahMembers, FalakPrayerTimes, FalakQiblas, FalakHijriCalendars, FalakHisabs, FalakRukyats, FalakEclipses, GoogleDriveConnections],
  globals: [Settings, OrganizationStructure],
  routes: {
    admin: ADMIN_ROUTE,
    api: API_ROUTE,
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
      importMapFile: path.resolve(dirname, `app/(payload)${ADMIN_ROUTE}/importMap.js`),
    },
  },
  secret,
  serverURL: process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL,
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
