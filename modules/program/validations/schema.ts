import { z } from "zod";

export const programStatusEnum = z.enum([
  "DRAFT",
  "PUBLISHED",
  "REGISTRATION_OPEN",
  "REGISTRATION_CLOSED",
  "ON_GOING",
  "COMPLETED",
  "CANCELLED",
  "ARCHIVED",
]);

export const registrationStatusEnum = z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]);

export const committeeStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

export const attendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]);

export const createProgramBase = z.object({
  code: z
    .string()
    .min(1, "Kode Program wajib diisi.")
    .max(30, "Kode Program maksimal 30 karakter.")
    .regex(/^\S+$/, "Kode Program tidak boleh mengandung spasi."),
  name: z
    .string()
    .min(5, "Nama Program minimal 5 karakter.")
    .max(255, "Nama Program maksimal 255 karakter."),
  type: z.string().min(1, "Jenis Program wajib dipilih."),
  description: z.string().max(5000, "Deskripsi maksimal 5000 karakter.").optional().or(z.literal("")),
  personInChargeId: z.string().min(1, "Penanggung Jawab wajib dipilih."),
  registrationOpen: z.string().optional().or(z.literal("")),
  registrationClose: z.string().optional().or(z.literal("")),
  startDate: z.string().min(1, "Tanggal Mulai wajib diisi."),
  endDate: z.string().min(1, "Tanggal Selesai wajib diisi."),
});

export const createProgramSchema = createProgramBase.refine(
  (data) => !data.endDate || !data.startDate || new Date(data.endDate) >= new Date(data.startDate),
  { message: "Tanggal selesai harus setelah tanggal mulai.", path: ["endDate"] },
);

export const updateProgramSchema = createProgramBase.partial().refine(
  (data) => !data.endDate || !data.startDate || new Date(data.endDate) >= new Date(data.startDate),
  { message: "Tanggal selesai harus setelah tanggal mulai.", path: ["endDate"] },
);

export const createScheduleSchema = z.object({
  title: z.string().min(1, "Judul jadwal wajib diisi.").max(255),
  venueId: z.string().optional().or(z.literal("")),
  startTime: z.string().min(1, "Waktu mulai wajib diisi."),
  endTime: z.string().min(1, "Waktu selesai wajib diisi."),
  description: z.string().optional().or(z.literal("")),
}).refine(
  (data) => !data.endTime || !data.startTime || new Date(data.endTime) > new Date(data.startTime),
  { message: "Waktu selesai harus setelah waktu mulai.", path: ["endTime"] },
);

export const assignCommitteeSchema = z.object({
  userId: z.string().min(1, "User wajib dipilih."),
  role: z.string().min(1, "Role panitia wajib diisi."),
});

export const registerParticipantSchema = z.object({
  userId: z.string().min(1, "User wajib dipilih."),
});

export const addDocumentationSchema = z.object({
  mediaId: z.string().min(1, "Media wajib dipilih."),
  title: z.string().min(1, "Judul wajib diisi.").max(255),
  description: z.string().optional().or(z.literal("")),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type AssignCommitteeInput = z.infer<typeof assignCommitteeSchema>;
export type RegisterParticipantInput = z.infer<typeof registerParticipantSchema>;
export type AddDocumentationInput = z.infer<typeof addDocumentationSchema>;