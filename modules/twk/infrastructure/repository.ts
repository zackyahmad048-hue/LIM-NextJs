import { prisma } from "@/modules/shared/infrastructure/prisma";
import type {
  WajibKhidmahMemberCreateInput,
  WajibKhidmahMemberEntity,
  WajibKhidmahMemberUpdateInput,
} from "../domain/entities";
import type { TwkRepository } from "../domain/repository";

const SEARCHABLE_FIELDS = [
  "nama",
  "alamat",
  "kelas",
  "posWajibKhidmah",
  "tempatWajibKhidmah",
] as const;

export const twkRepository: TwkRepository = {
  async findMany({ search, page, limit }) {
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = SEARCHABLE_FIELDS.map((field) => ({
        [field]: { contains: search },
      }));
    }

    const [items, total] = await Promise.all([
      prisma.wajibKhidmahMember.findMany({
        where: where as never,
        orderBy: { createdAt: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.wajibKhidmahMember.count({ where: where as never }),
    ]);

    return {
      items: items as unknown as WajibKhidmahMemberEntity[],
      total,
    };
  },

  async findAll() {
    const items = await prisma.wajibKhidmahMember.findMany({
      orderBy: { createdAt: "asc" },
    });
    return items as unknown as WajibKhidmahMemberEntity[];
  },

  async findById(id) {
    const item = await prisma.wajibKhidmahMember.findUnique({ where: { id } });
    return item as WajibKhidmahMemberEntity | null;
  },

  async create(data: WajibKhidmahMemberCreateInput) {
    const item = await prisma.wajibKhidmahMember.create({
      data: data as never,
    });
    return item as WajibKhidmahMemberEntity;
  },

  async createMany(data: WajibKhidmahMemberCreateInput[]) {
    const result = await prisma.wajibKhidmahMember.createMany({
      data: data as never,
    });
    return result.count;
  },

  async update(id: string, data: WajibKhidmahMemberUpdateInput) {
    const item = await prisma.wajibKhidmahMember.update({
      where: { id },
      data: data as never,
    });
    return item as WajibKhidmahMemberEntity;
  },

  async delete(id: string) {
    await prisma.wajibKhidmahMember.delete({ where: { id } });
  },
};
