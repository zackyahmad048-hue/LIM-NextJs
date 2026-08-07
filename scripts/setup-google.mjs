// Setup otomatis Google Sheets untuk integrasi pendataan (sekretariat & falak).
// Catatan: service account tidak bisa membuat file Drive/Docs di akun konsumen
// (tanpa storage quota). Reporting cukup dengan menulis ke spreadsheet yang
// di-share, sehingga hanya spreadsheet yang dibuat di sini.

import { google } from "googleapis";

process.loadEnvFile();

const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const SERVICE_ACCOUNT_PRIVATE_KEY =
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
const ORGANIZATION_EMAILS = (process.env.GOOGLE_ORGANIZATION_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim())
  .filter(Boolean);

if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PRIVATE_KEY) {
  console.error(
    "[setup-google] GOOGLE_SERVICE_ACCOUNT_EMAIL dan/atau GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY belum diisi di .env.",
  );
  process.exit(1);
}

const auth = new google.auth.JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n"),
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
});

const sheets = google.sheets({ version: "v4", auth });
const drive = google.drive({ version: "v3", auth });

const PENDATAAN_TABS = [
  [
    "SuratMasuk",
    [
      "id",
      "registrationNumber",
      "sender",
      "subject",
      "senderAddress",
      "receivedDate",
      "status",
      "classification",
      "category",
      "notes",
      "attachmentUrl",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ],
  ],
  [
    "SuratKeluar",
    [
      "id",
      "registrationNumber",
      "recipient",
      "subject",
      "senderName",
      "mailDate",
      "status",
      "documentNumber",
      "documentType",
      "content",
      "approvedById",
      "approvedAt",
      "attachmentUrl",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ],
  ],
  [
    "Disposisi",
    [
      "id",
      "incomingMailId",
      "assignedToId",
      "instruction",
      "priority",
      "status",
      "dueDate",
      "notes",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ],
  ],
  [
    "DokumenAdministrasi",
    [
      "id",
      "documentNumber",
      "documentType",
      "title",
      "description",
      "content",
      "status",
      "submittedById",
      "submittedAt",
      "approvedById",
      "approvedAt",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ],
  ],
  [
    "ArsipDokumen",
    [
      "id",
      "archiveNumber",
      "title",
      "documentType",
      "category",
      "retentionYear",
      "archivedAt",
      "createdAt",
    ],
  ],
  [
    "Agenda",
    [
      "id",
      "date",
      "title",
      "description",
      "location",
      "participants",
      "notes",
      "createdAt",
    ],
  ],
];

const FALAK_TABS = [
  [
    "PrayerTime",
    [
      "id",
      "locationName",
      "latitude",
      "longitude",
      "timezone",
      "calculationMethod",
      "prayerDate",
      "fajr",
      "sunrise",
      "dhuhr",
      "asr",
      "maghrib",
      "isha",
      "createdAt",
    ],
  ],
  ["Qibla", ["id", "latitude", "longitude", "direction", "createdAt"]],
  [
    "HijriCalendar",
    [
      "id",
      "gregorianDate",
      "hijriYear",
      "hijriMonth",
      "hijriDay",
      "method",
      "createdAt",
    ],
  ],
  [
    "Rukyat",
    [
      "id",
      "observationDate",
      "locationName",
      "latitude",
      "longitude",
      "observerId",
      "weather",
      "result",
      "notes",
      "status",
      "createdAt",
      "deletedAt",
    ],
  ],
  [
    "Eclipse",
    ["id", "eclipseType", "eclipseDate", "visibility", "details", "createdAt"],
  ],
];

async function createSpreadsheet(title, tabs) {
  console.log(`\n[+] Membuat spreadsheet "${title}" ...`);
  const res = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title },
      sheets: tabs.map(([tab]) => ({
        properties: {
          title: tab,
          gridProperties: { rowCount: 1000, columnCount: 20 },
        },
      })),
    },
  });

  const spreadsheetId = res.data.spreadsheetId;
  for (const [tab, headers] of tabs) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tab}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [headers] },
    });
    console.log(`  - tab "${tab}" siap.`);
  }

  return spreadsheetId;
}

async function share(fileId, title) {
  if (ORGANIZATION_EMAILS.length === 0) return;
  console.log(`  - share "${title}" ke: ${ORGANIZATION_EMAILS.join(", ")}`);
  for (const email of ORGANIZATION_EMAILS) {
    await drive.permissions.create({
      fileId,
      requestBody: { type: "user", role: "writer", emailAddress: email },
      fields: "id",
    });
  }
}

async function main() {
  console.log(
    "Membuat resource Google sebagai service account:",
    SERVICE_ACCOUNT_EMAIL,
  );

  const pendataanId = await createSpreadsheet(
    "LIM - Pendataan Sekretariat",
    PENDATAAN_TABS,
  );
  await share(pendataanId, "LIM - Pendataan Sekretariat");

  const falakId = await createSpreadsheet("LIM - Data Falak", FALAK_TABS);
  await share(falakId, "LIM - Data Falak");

  console.log("\n=== SELESAI. Salin ke .env ===");
  console.log(`GOOGLE_SPREADSHEET_PENDATAAN_ID="${pendataanId}"`);
  console.log(`GOOGLE_SPREADSHEET_FALAK_ID="${falakId}"`);
  console.log("\nKemudian restart: npm run dev");
}

main().catch((error) => {
  const exactError = error.response?.data?.error?.message || error.message;
  console.error("\n[setup-google] Gagal mengeksekusi script API!");
  console.error("Detail Error:", exactError);
  process.exit(1);
});
