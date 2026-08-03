// Setup otomatis Google Sheets & Docs untuk integrasi pendataan (sekretariat & falak).
//
// Cara pakai:
//   1. Isi .env dengan GOOGLE_SERVICE_ACCOUNT_EMAIL dan GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
//      (script memakai service account ini sebagai pemilik resource).
//   2. Opsional: GOOGLE_ORGANIZATION_EMAILS (dipisah koma) untuk share akses editor
//      ke akun admin/operator organisasi.
//   3. Jalankan:  node scripts/setup-google.mjs
//   4. Salin ID yang dicetak ke .env:
//      GOOGLE_SPREADSHEET_PENDATAAN_ID, GOOGLE_SPREADSHEET_FALAK_ID,
//      GOOGLE_DOC_TEMPLATE_SURAT_KELUAR_ID, GOOGLE_DOC_TEMPLATE_DOK_ADMIN_ID
//
// CATATAN: header di bawah harus selalu sinkron dengan konstanta HEADERS di
// modules/secretariat/infrastructure/repository.sheets.ts dan
// modules/falak/infrastructure/repository.sheets.ts.

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
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive.file",
  ],
});

const sheets = google.sheets({ version: "v4", auth });
const docs = google.docs({ version: "v1", auth });
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
      "googleDocId",
      "googleDocUrl",
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
      "googleDocId",
      "googleDocUrl",
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

function paragraph(text, { bold = false, alignment = "START" } = {}) {
  const el = {
    paragraph: {
      elements: [{ textRun: { content: `${text}\n`, textStyle: {} } }],
      paragraphStyle: { alignment },
    },
  };
  if (bold) el.paragraph.elements[0].textRun.textStyle.bold = true;
  return el;
}

function blank() {
  return {
    paragraph: {
      elements: [{ textRun: { content: "\n", textStyle: {} } }],
      paragraphStyle: {},
    },
  };
}

function metaLine(label, value) {
  return {
    paragraph: {
      elements: [
        { textRun: { content: label, textStyle: { bold: true } } },
        { textRun: { content: `: ${value}`, textStyle: {} } },
      ],
      paragraphStyle: {},
    },
  };
}

const SURAT_KELUAR_BODY = [
  paragraph("{{namaOrganisasi}}", { bold: true, alignment: "CENTER" }),
  paragraph("Alamat | Telepon | Email", { alignment: "CENTER" }),
  paragraph(
    "________________________________________________________________",
    { alignment: "CENTER" },
  ),
  blank(),
  metaLine("Nomor", "{{nomorSurat}}"),
  metaLine("Tanggal", "{{tanggalSurat}}"),
  metaLine("Perihal", "{{perihal}}"),
  metaLine("Kepada Yth.", "{{penerima}}"),
  blank(),
  paragraph("Dengan hormat,"),
  paragraph("{{isi}}"),
  blank(),
  blank(),
  paragraph("Hormat kami,"),
  blank(),
  blank(),
  paragraph("{{namaPengirim}}"),
  paragraph("Jabatan"),
];

const DOKUMEN_ADMIN_BODY = [
  paragraph("{{judul}}", { bold: true, alignment: "CENTER" }),
  metaLine("Nomor", "{{nomorDokumen}}"),
  blank(),
  paragraph("{{isi}}"),
  blank(),
  blank(),
  paragraph("Mengetahui,"),
  blank(),
  blank(),
  paragraph("{{namaPengirim}}"),
  paragraph("Jabatan"),
];

async function createSpreadsheet(title, tabs) {
  console.log(`\n[1/4] Membuat spreadsheet "${title}" ...`);
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
    console.log(`  - tab "${tab}" (${headers.length} kolom) siap.`);
  }

  return spreadsheetId;
}

function elementLength(el) {
  return (el.paragraph?.elements ?? []).reduce(
    (sum, e) => sum + (e.textRun?.content ?? "").length,
    0,
  );
}

async function createTemplateDoc(title, lines) {
  console.log(`\n[1/4] Membuat template "${title}" ...`);
  const content = [];
  let index = 1;
  for (const el of lines) {
    const length = elementLength(el);
    content.push({ ...el, startIndex: index, endIndex: index + length });
    index += length;
  }

  const res = await docs.documents.create({
    requestBody: { title, body: { content } },
  });

  return res.data.documentId;
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
  console.log(
    "Share ke organisasi:",
    ORGANIZATION_EMAILS.length > 0
      ? ORGANIZATION_EMAILS.join(", ")
      : "(tidak ada, lewati share)",
  );

  const pendataanId = await createSpreadsheet(
    "LIM - Pendataan Sekretariat",
    PENDATAAN_TABS,
  );
  await share(pendataanId, "LIM - Pendataan Sekretariat");

  const falakId = await createSpreadsheet("LIM - Data Falak", FALAK_TABS);
  await share(falakId, "LIM - Data Falak");

  const suratKeluarTemplateId = await createTemplateDoc(
    "TEMPLATE - Surat Keluar",
    SURAT_KELUAR_BODY,
  );
  await share(suratKeluarTemplateId, "TEMPLATE - Surat Keluar");

  const dokAdminTemplateId = await createTemplateDoc(
    "TEMPLATE - Dokumen Administrasi",
    DOKUMEN_ADMIN_BODY,
  );
  await share(dokAdminTemplateId, "TEMPLATE - Dokumen Administrasi");

  console.log("\n=== SELESAI. Salin ke .env ===");
  console.log(`GOOGLE_SPREADSHEET_PENDATAAN_ID="${pendataanId}"`);
  console.log(`GOOGLE_SPREADSHEET_FALAK_ID="${falakId}"`);
  console.log(`GOOGLE_DOC_TEMPLATE_SURAT_KELUAR_ID="${suratKeluarTemplateId}"`);
  console.log(`GOOGLE_DOC_TEMPLATE_DOK_ADMIN_ID="${dokAdminTemplateId}"`);
  console.log(`DATA_SOURCE=sheets`);
  console.log("\nKemudian restart: npm run dev");
}

main().catch((error) => {
  console.error(
    "[setup-google] Gagal:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
