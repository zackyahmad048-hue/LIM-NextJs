import type { CollectionConfig } from "payload";

import { canManageDriveConnections } from "./access";

export const GoogleDriveConnections: CollectionConfig = {
  slug: "google-drive-connections",
  // avoid clash with Prisma "google_drive_connection" table on shared Neon DB
  dbName: "payload_google_drive_connections",
  admin: {
    hidden: true,
    description: "Koneksi OAuth Google Drive (token arsip surat).",
  },
  access: {
    read: canManageDriveConnections,
    create: canManageDriveConnections,
    update: canManageDriveConnections,
    delete: canManageDriveConnections,
  },
  fields: [
    {
      name: "email",
      type: "text",
      required: true,
    },
    {
      name: "refreshToken",
      type: "text",
      required: true,
    },
    {
      name: "driveFolderId",
      type: "text",
    },
    {
      name: "driveFolderName",
      type: "text",
    },
  ],
  timestamps: true,
};
