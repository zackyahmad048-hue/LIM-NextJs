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

// Lives beside app/(payload)/cms/[[...segments]]/page.tsx, which imports it as
// "../importMap.js". Kept in one place so the config and the route folder agree.
const IMPORT_MAP_DIR = "app/(payload)/cms";
const IMPORT_MAP_FILE = path.resolve(dirname, IMPORT_MAP_DIR, "importMap.js");

const PLACEHOLDER_SECRETS = new Set([
  "CHANGE-ME",
  "your-payload-secret",
  "your-super-secret-key",
]);

const secret = process.env.PAYLOAD_SECRET || process.env.BETTER_AUTH_SECRET;

if (!secret || PLACEHOLDER_SECRETS.has(secret)) {
  throw new Error(
    "Missing or placeholder PAYLOAD_SECRET. Generate one with `openssl rand -base64 32` and add it to .env. " +
      "BETTER_AUTH_SECRET is accepted as a fallback.",
  );
}

/**
 * Payload pushes `serverURL` into its CSRF allowlist and uses it verbatim as
 * the request origin. Pinning it to a `localhost` value that only holds in
 * local `.env` would break origin checks on any real deployment, so it is only
 * set when the configured URL is an absolute, non-localhost origin. Otherwise
 * Payload derives the origin from request headers, which is correct behind a
 * proxy and on Vercel.
 */
function resolveServerURL(): string | undefined {
  const candidates = [
    process.env.SERVER_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.BETTER_AUTH_URL,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    let parsed: URL;
    try {
      parsed = new URL(candidate);
    } catch {
      continue;
    }

    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      continue;
    }

    return parsed.origin;
  }

  return undefined;
}

export default buildConfig({
  collections: [Users, Posts, Categories, Media, Pages, Bidang, Units, Officers, AgendaBooks, IncomingMails, OutgoingMails, Dispositions, AdministrativeDocuments, DocumentArchives, Programs, ProgramSchedules, ProgramCommittees, Participants, Attendances, ProgramDocumentations, WajibKhidmahLembagas, WajibKhidmahMembers, FalakPrayerTimes, FalakQiblas, FalakHijriCalendars, FalakHisabs, FalakRukyats, FalakEclipses, GoogleDriveConnections],
  globals: [Settings, OrganizationStructure],
  routes: {
    admin: ADMIN_ROUTE,
    api: API_ROUTE,
    graphQL: `${API_ROUTE}/graphql`,
    graphQLPlayground: `${API_ROUTE}/graphql-playground`,
  },
  admin: {
    user: Users.slug,
    components: {
      // disableLocalStrategy removes Payload's own login form, so point people
      // at the application login, and clear the Better Auth session on logout.
      beforeLogin: [{ path: "@/collections/better-auth-login#BeforeLogin" }],
      logout: {
        Button: { path: "@/collections/better-auth-logout#BetterAuthLogout" },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
      // Explicit literal, not derived from ADMIN_ROUTE. The (payload) route
      // group does not contribute a URL segment, so the folder name is a free
      // filesystem choice that need not match the URL. This path is the one
      // that must point at a file that exists.
      importMapFile: IMPORT_MAP_FILE,
    },
  },
  secret,
  serverURL: resolveServerURL(),
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
