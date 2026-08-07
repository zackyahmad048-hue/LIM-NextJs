import { z } from "zod";

export const incomingMailStatusEnum = z.enum([
  "RECEIVED",
  "PROCESSED",
  "ARCHIVED",
]);

export const outgoingMailStatusEnum = z.enum([
  "DRAFT",
  "SUBMITTED",
  "REVIEWED",
  "APPROVED",
  "REJECTED",
  "SIGNED",
  "SENT",
  "ARCHIVED",
]);

export const dispositionStatusEnum = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
]);

export const administrativeDocumentStatusEnum = z.enum([
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "ARCHIVED",
]);

export const documentTypeEnum = z.enum([
  "UNDANGAN",
  "PERMOHONAN",
  "PEMBERITAHUAN",
  "INSTRUKSI",
  "KETERANGAN",
  "KEPUTUSAN",
  "TERIMA_KASIH",
  "LAINNYA",
]);

// Incoming Mail
export const createIncomingMailBase = z.object({
  registrationNumber: z
    .string()
    .min(1, "Nomor registrasi wajib diisi.")
    .max(50, "Nomor registrasi maksimal 50 karakter."),
  sender: z
    .string()
    .min(1, "Pengirim wajib diisi.")
    .max(255, "Nama pengirim maksimal 255 karakter."),
  subject: z
    .string()
    .min(1, "Perihal wajib diisi.")
    .max(500, "Perihal maksimal 500 karakter."),
  senderAddress: z
    .string()
    .max(500, "Alamat pengirim maksimal 500 karakter.")
    .optional()
    .or(z.literal("")),
  receivedDate: z.string().min(1, "Tanggal diterima wajib diisi."),
  classification: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  notes: z
    .string()
    .max(2000, "Catatan maksimal 2000 karakter.")
    .optional()
    .or(z.literal("")),
  attachmentUrl: z.string().optional().or(z.literal("")),
});

export const createIncomingMailSchema = createIncomingMailBase.refine(
  (data) => !data.receivedDate || new Date(data.receivedDate) <= new Date(),
  {
    message: "Tanggal diterima tidak boleh di masa depan.",
    path: ["receivedDate"],
  },
);

export const updateIncomingMailSchema = createIncomingMailBase
  .partial()
  .refine(
    (data) => !data.receivedDate || new Date(data.receivedDate) <= new Date(),
    {
      message: "Tanggal diterima tidak boleh di masa depan.",
      path: ["receivedDate"],
    },
  );

// Outgoing Mail
export const createOutgoingMailBase = z.object({
  mailDate: z.string().min(1, "Tanggal surat wajib diisi."),
  subject: z
    .string()
    .min(1, "Perihal surat wajib diisi.")
    .max(500, "Perihal surat maksimal 500 karakter."),
  levelCode: z.string().min(1, "Tingkat kepengurusan wajib dipilih."),
  categoryCode: z.string().min(1, "Kategori surat wajib dipilih."),
  content: z
    .string()
    .max(10000, "Isi surat maksimal 10000 karakter.")
    .optional()
    .or(z.literal("")),
  recipient: z
    .string()
    .max(255, "Nama penerima maksimal 255 karakter.")
    .optional()
    .or(z.literal("")),
  senderName: z
    .string()
    .max(255, "Nama pengirim maksimal 255 karakter.")
    .optional()
    .or(z.literal("")),
  attachmentUrl: z.string().optional().or(z.literal("")),
});

export const createOutgoingMailSchema = createOutgoingMailBase.refine(
  (data) => !data.mailDate || new Date(data.mailDate) <= new Date(),
  { message: "Tanggal surat tidak boleh di masa depan.", path: ["mailDate"] },
);

export const updateOutgoingMailSchema = createOutgoingMailBase
  .partial()
  .refine((data) => !data.mailDate || new Date(data.mailDate) <= new Date(), {
    message: "Tanggal surat tidak boleh di masa depan.",
    path: ["mailDate"],
  });

// Disposition
export const createDispositionBase = z.object({
  incomingMailId: z.string().min(1, "Surat masuk wajib dipilih."),
  assignedToId: z.string().min(1, "Tujuan disposisi wajib dipilih."),
  instruction: z
    .string()
    .min(1, "Instruksi wajib diisi.")
    .max(1000, "Instruksi maksimal 1000 karakter."),
  priority: z.string().min(1, "Prioritas wajib dipilih."),
  dueDate: z.string().optional().or(z.literal("")),
  notes: z
    .string()
    .max(2000, "Catatan maksimal 2000 karakter.")
    .optional()
    .or(z.literal("")),
});

export const createDispositionSchema = createDispositionBase.refine(
  (data) => !data.dueDate || new Date(data.dueDate) >= new Date(),
  { message: "Batas waktu tidak boleh di masa lalu.", path: ["dueDate"] },
);

export const updateDispositionSchema = createDispositionBase
  .partial()
  .refine((data) => !data.dueDate || new Date(data.dueDate) >= new Date(), {
    message: "Batas waktu tidak boleh di masa lalu.",
    path: ["dueDate"],
  });

// Administrative Document
export const createAdministrativeDocumentBase = z.object({
  documentNumber: z
    .string()
    .min(1, "Nomor dokumen wajib diisi.")
    .max(50, "Nomor dokumen maksimal 50 karakter."),
  documentType: documentTypeEnum,
  title: z
    .string()
    .min(1, "Judul wajib diisi.")
    .max(255, "Judul maksimal 255 karakter."),
  description: z
    .string()
    .max(2000, "Deskripsi maksimal 2000 karakter.")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .max(10000, "Konten maksimal 10000 karakter.")
    .optional()
    .or(z.literal("")),
});

export const createAdministrativeDocumentSchema =
  createAdministrativeDocumentBase;

export const updateAdministrativeDocumentSchema =
  createAdministrativeDocumentBase.partial();

// Agenda Book
export const createAgendaBookSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi."),
  title: z
    .string()
    .min(1, "Judul wajib diisi.")
    .max(255, "Judul maksimal 255 karakter."),
  description: z
    .string()
    .max(2000, "Deskripsi maksimal 2000 karakter.")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(255, "Lokasi maksimal 255 karakter.")
    .optional()
    .or(z.literal("")),
  participants: z
    .string()
    .max(2000, "Peserta maksimal 2000 karakter.")
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .max(2000, "Catatan maksimal 2000 karakter.")
    .optional()
    .or(z.literal("")),
});

// Document Archive
export const createDocumentArchiveSchema = z.object({
  archiveNumber: z
    .string()
    .min(1, "Nomor arsip wajib diisi.")
    .max(50, "Nomor arsip maksimal 50 karakter."),
  title: z
    .string()
    .min(1, "Judul wajib diisi.")
    .max(255, "Judul maksimal 255 karakter."),
  documentType: documentTypeEnum,
  category: z
    .string()
    .max(255, "Kategori maksimal 255 karakter.")
    .optional()
    .or(z.literal("")),
  retentionYear: z.coerce
    .number()
    .int()
    .positive("Masa retensi harus positif.")
    .optional(),
});

export type CreateIncomingMailInput = z.infer<typeof createIncomingMailSchema>;
export type UpdateIncomingMailInput = z.infer<typeof updateIncomingMailSchema>;
export type CreateOutgoingMailInput = z.infer<typeof createOutgoingMailSchema>;
export type UpdateOutgoingMailInput = z.infer<typeof updateOutgoingMailSchema>;
export type CreateDispositionInput = z.infer<typeof createDispositionSchema>;
export type UpdateDispositionInput = z.infer<typeof updateDispositionSchema>;
export type CreateAdministrativeDocumentInput = z.infer<
  typeof createAdministrativeDocumentSchema
>;
export type UpdateAdministrativeDocumentInput = z.infer<
  typeof updateAdministrativeDocumentSchema
>;
export const updateAgendaBookSchema = createAgendaBookSchema.partial();

export type CreateAgendaBookInput = z.infer<typeof createAgendaBookSchema>;
export type UpdateAgendaBookInput = z.infer<typeof updateAgendaBookSchema>;
export type CreateDocumentArchiveInput = z.infer<
  typeof createDocumentArchiveSchema
>;

// Verified Letter (QR)
export const createVerifiedLetterSchema = z.object({
  letterType: z
    .string()
    .min(1, "Jenis surat wajib dipilih."),
  registrationNumber: z
    .string()
    .min(1, "Nomor surat wajib diisi.")
    .max(100, "Nomor surat maksimal 100 karakter."),
  subject: z
    .string()
    .min(1, "Perihal wajib diisi.")
    .max(500, "Perihal maksimal 500 karakter."),
  date: z
    .string()
    .min(1, "Tanggal surat wajib diisi."),
  issuer: z
    .string()
    .max(255, "Penerbit maksimal 255 karakter.")
    .optional()
    .or(z.literal("")),
});
