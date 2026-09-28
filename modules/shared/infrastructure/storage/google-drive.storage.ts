import { google, type drive_v3 } from "googleapis";

import { getPayloadClient } from "@/modules/cms/infrastructure/payload";
import type { GoogleDriveConnection } from "@/payload-types";
import type { FileStorage } from "./types";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export class GoogleDriveNotConfiguredError extends Error {
  constructor() {
    super(
      "Google Drive belum dikonfigurasi. Set GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET di .env.",
    );
    this.name = "GoogleDriveNotConfiguredError";
  }
}

export class GoogleDriveNotConnectedError extends Error {
  constructor() {
    super(
      "Google Drive belum terhubung. Hubungkan akun Google di halaman Surat Menyurat.",
    );
    this.name = "GoogleDriveNotConnectedError";
  }
}

function requireClient() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new GoogleDriveNotConfiguredError();
  }
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/admin/google-drive/callback`,
  );
}

export async function getDriveConnection(): Promise<GoogleDriveConnection | null> {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: "google-drive-connections",
    limit: 1,
    depth: 0,
  });
  return res.docs[0] ?? null;
}

type DriveConnection = GoogleDriveConnection;

function driveFromConnection(connection: DriveConnection) {
  const client = requireClient();
  client.setCredentials({ refresh_token: connection.refreshToken });
  return google.drive({ version: "v3", auth: client }) as drive_v3.Drive;
}

export function getDriveAuthUrl(): string {
  const client = requireClient();
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive.file"],
  });
}

export async function exchangeDriveCode(code: string): Promise<{
  email: string | null;
  refreshToken: string | null;
}> {
  const client = requireClient();
  const { tokens } = await client.getToken(code);
  if (!tokens.refresh_token) {
    throw new Error(
      "Tidak ada refresh token dari Google. Pastikan aplikasi dalam mode production atau coba lagi.",
    );
  }

  client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: "v2", auth: client });
  const { data } = await oauth2.userinfo.get();

  return { email: data.email ?? null, refreshToken: tokens.refresh_token };
}

export async function saveDriveConnection(
  email: string,
  refreshToken: string,
): Promise<void> {
  const payload = await getPayloadClient();
  const existing = await getDriveConnection();
  if (existing) {
    await payload.update({
      collection: "google-drive-connections",
      id: existing.id,
      data: { email, refreshToken },
    });
    return;
  }
  await payload.create({
    collection: "google-drive-connections",
    data: { email, refreshToken },
  });
}

export async function deleteDriveConnection(): Promise<void> {
  const existing = await getDriveConnection();
  if (!existing) return;
  const payload = await getPayloadClient();
  await payload.delete({
    collection: "google-drive-connections",
    id: existing.id,
  });
}

export async function createDriveClient() {
  const connection = await getDriveConnection();
  if (!connection) throw new GoogleDriveNotConnectedError();

  return { drive: driveFromConnection(connection), connection };
}

/**
 * Penyimpanan Google Drive (OAuth user flow). File disimpan privat
 * di folder Drive organisasi; akses lewat aplikasi memakai token.
 */
export class GoogleDriveStorage implements FileStorage {
  async save(
    buffer: Buffer,
    name: string,
    mimeType: string,
    connection?: DriveConnection,
  ): Promise<string> {
    const conn = connection ?? (await createDriveClient()).connection;
    const drive = driveFromConnection(conn);

    const folderId =
      conn.driveFolderId ??
      (await ensureDriveFolder(
        drive,
        conn.driveFolderName ?? undefined,
        conn.id,
      ));

    const response = await drive.files.create({
      requestBody: {
        name,
        parents: [folderId],
      },
      media: {
        mimeType,
        body: buffer,
      },
      fields: "id",
    });

    const fileId = response.data.id;
    if (!fileId) throw new Error("Gagal mengunggah file ke Google Drive.");
    return fileId;
  }

  async read(fileId: string): Promise<Buffer> {
    const { drive } = await createDriveClient();
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "arraybuffer" },
    );
    return Buffer.from(response.data as ArrayBuffer);
  }

  async remove(fileId: string): Promise<void> {
    const { drive } = await createDriveClient();
    await drive.files.update({
      fileId,
      requestBody: { trashed: true },
    });
  }
}

async function ensureDriveFolder(
  drive: drive_v3.Drive,
  folderName?: string,
  connectionId?: number,
): Promise<string> {
  const targetName = folderName ?? "LIM-Arsip";

  const existing = await drive.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and trashed=false and name='${targetName.replace(/'/g, "\\'")}'`,
    fields: "files(id, name)",
    pageSize: 1,
  });
  if (existing.data.files?.[0]?.id) {
    return existing.data.files[0].id;
  }

  const created = await drive.files.create({
    requestBody: {
      name: targetName,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id",
  });
  const id = created.data.id;
  if (!id) throw new Error("Gagal membuat folder arsip di Google Drive.");

  if (connectionId !== undefined) {
    const payload = await getPayloadClient();
    await payload.update({
      collection: "google-drive-connections",
      id: connectionId,
      data: { driveFolderId: id, driveFolderName: targetName },
    });
  }

  return id;
}
