import { z } from "zod";

const boardMemberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Nama wajib diisi"),
  position: z.string(),
  image: z.string(),
  sortOrder: z.number().int(),
});

const regionalBoardSchema = z.object({
  id: z.string().min(1),
  province: z.string(),
  name: z.string(),
  members: z.array(boardMemberSchema),
});

const branchBoardSchema = z.object({
  id: z.string().min(1),
  province: z.string(),
  regency: z.string(),
  name: z.string(),
  members: z.array(boardMemberSchema),
});

export const orgStructureSchema = z.object({
  organization: z.object({
    name: z.string().min(1, "Nama organisasi wajib diisi"),
    shortName: z.string(),
    logo: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    website: z.string(),
  }),
  googleSheetUrl: z.string(),
  centralBoard: z.array(boardMemberSchema),
  regionalBoards: z.array(regionalBoardSchema),
  branchBoards: z.array(branchBoardSchema),
  members: z.array(boardMemberSchema),
});

export type OrgStructureInput = z.infer<typeof orgStructureSchema>;
