import { prisma } from "@/modules/shared/infrastructure/prisma";
import type {
  WajibKhidmahLembagaCreateInput,
  WajibKhidmahLembagaEntity,
} from "../domain/entities";
import type { LembagaRepository } from "../domain/repository";

const SEARCHABLE_FIELDS = [
  "namaLembagaPendidikan",
  "desaKelurahan",
  "kecamatan",
  "kabupatenKota",
  "provinsi",
  "pengasuhNama",
  "penanggungJawabNama",
] as const;

export const lembagaRepository: LembagaRepository = {
  async findMany({ search, page, limit }) {
    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = SEARCHABLE_FIELDS.map((field) => ({
        [field]: { contains: search },
      }));
    }

    const [items, total] = await Promise.all([
      prisma.wajibKhidmahLembaga.findMany({
        where: where as never,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.wajibKhidmahLembaga.count({ where: where as never }),
    ]);

    return {
      items: items as unknown as WajibKhidmahLembagaEntity[],
      total,
    };
  },

  async findById(id) {
    const item = await prisma.wajibKhidmahLembaga.findUnique({
      where: { id },
    });
    return item as WajibKhidmahLembagaEntity | null;
  },

  async create(data: WajibKhidmahLembagaCreateInput) {
    const item = await prisma.wajibKhidmahLembaga.create({
      data: data as never,
    });
    return item as WajibKhidmahLembagaEntity;
  },
};
