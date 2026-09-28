import type { GlobalConfig } from "payload";
import { allowPublicRead, canManageSettings } from "../collections/access";

export const OrganizationStructure: GlobalConfig = {
  slug: "organization-structure",
  dbName: "payload_organization_structure",
  admin: {
    group: "System",
    description: "Struktur organisasi: info organisasi, google sheet URL, pengurus pusat, wilayah, cabang, anggota.",
  },
  access: {
    read: allowPublicRead,
    update: canManageSettings,
  },
  fields: [
    {
      name: "organization",
      type: "group",
      label: "Info Organisasi",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "shortName", type: "text" },
        { name: "logo", type: "text" },
        { name: "address", type: "textarea" },
        { name: "phone", type: "text" },
        { name: "email", type: "text" },
        { name: "website", type: "text" },
      ],
    },
    {
      name: "googleSheetUrl",
      type: "text",
      label: "Google Sheet URL",
    },
    {
      name: "centralBoard",
      type: "array",
      label: "Pengurus Pusat",
      fields: [
        { name: "id", type: "text", required: true, admin: { readOnly: true } },
        { name: "name", type: "text", required: true },
        { name: "position", type: "text", required: true },
        { name: "image", type: "text" },
        { name: "sortOrder", type: "number", defaultValue: 0 },
      ],
    },
    {
      name: "regionalBoards",
      type: "array",
      dbName: "rb",
      label: "Pengurus Wilayah",
      fields: [
        { name: "id", type: "text", required: true, admin: { readOnly: true } },
        { name: "province", type: "text", required: true },
        { name: "name", type: "text", required: true },
        {
          name: "members",
          type: "array",
          fields: [
            { name: "id", type: "text", required: true, admin: { readOnly: true } },
            { name: "name", type: "text", required: true },
            { name: "position", type: "text", required: true },
            { name: "image", type: "text" },
            { name: "sortOrder", type: "number", defaultValue: 0 },
          ],
        },
      ],
    },
    {
      name: "branchBoards",
      type: "array",
      dbName: "bb",
      label: "Pengurus Cabang",
      fields: [
        { name: "id", type: "text", required: true, admin: { readOnly: true } },
        { name: "province", type: "text", required: true },
        { name: "regency", type: "text", required: true },
        { name: "name", type: "text", required: true },
        {
          name: "members",
          type: "array",
          fields: [
            { name: "id", type: "text", required: true, admin: { readOnly: true } },
            { name: "name", type: "text", required: true },
            { name: "position", type: "text", required: true },
            { name: "image", type: "text" },
            { name: "sortOrder", type: "number", defaultValue: 0 },
          ],
        },
      ],
    },
    {
      name: "members",
      type: "array",
      label: "Anggota",
      fields: [
        { name: "id", type: "text", required: true, admin: { readOnly: true } },
        { name: "name", type: "text", required: true },
        { name: "position", type: "text", required: true },
        { name: "image", type: "text" },
        { name: "sortOrder", type: "number", defaultValue: 0 },
      ],
    },
  ],
};