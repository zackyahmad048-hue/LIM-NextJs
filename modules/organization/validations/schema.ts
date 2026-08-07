import { z } from "zod";

export const unitLevelEnum = z.enum(["PP", "PW", "PC"]);

export const createUnitSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Kode unit minimal 2 karakter")
    .max(20, "Kode unit maksimal 20 karakter"),
  name: z
    .string()
    .trim()
    .min(3, "Nama unit minimal 3 karakter")
    .max(120, "Nama unit maksimal 120 karakter"),
  level: unitLevelEnum,
  parentId: z.string().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export const updateUnitSchema = createUnitSchema.partial();

export const createOfficerSchema = z.object({
  unitId: z.string().min(1, "Unit wajib dipilih"),
  name: z
    .string()
    .trim()
    .min(3, "Nama pengurus minimal 3 karakter")
    .max(120, "Nama pengurus maksimal 120 karakter"),
  position: z
    .string()
    .trim()
    .min(2, "Jabatan minimal 2 karakter")
    .max(120, "Jabatan maksimal 120 karakter"),
  isLeader: z.coerce.boolean().optional(),
  phone: z.string().trim().optional().or(z.literal("")),
  email: z.string().trim().email("Email tidak valid").optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

export const updateOfficerSchema = createOfficerSchema.partial();
